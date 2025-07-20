import { ErrorHandler, ValidationUtils, RetryUtils, ERROR_MESSAGES } from '../lib/errorHandling';

describe('Error Handling', () => {
  describe('ErrorHandler', () => {
    describe('createUploadError', () => {
      it('should create file-too-large error', () => {
        const error = ErrorHandler.createUploadError('file-too-large');
        expect(error.type).toBe('file-too-large');
        expect(error.message).toBe(ERROR_MESSAGES.FILE_TOO_LARGE);
        expect(error.retryable).toBe(false);
      });

      it('should create invalid-file-type error', () => {
        const error = ErrorHandler.createUploadError('invalid-file-type');
        expect(error.type).toBe('invalid-file-type');
        expect(error.message).toBe(ERROR_MESSAGES.INVALID_FILE_TYPE);
        expect(error.retryable).toBe(false);
      });

      it('should create retryable upload error', () => {
        const error = ErrorHandler.createUploadError('upload-failed');
        expect(error.type).toBe('upload-failed');
        expect(error.message).toBe(ERROR_MESSAGES.UPLOAD_FAILED);
        expect(error.retryable).toBe(true);
      });

      it('should use custom message when provided', () => {
        const customMessage = 'Custom error message';
        const error = ErrorHandler.createUploadError('file-too-large', customMessage);
        expect(error.message).toBe(customMessage);
      });
    });

    describe('createChatError', () => {
      it('should create api error', () => {
        const error = ErrorHandler.createChatError('api');
        expect(error.type).toBe('api');
        expect(error.message).toBe(ERROR_MESSAGES.AI_SERVICE_UNAVAILABLE);
        expect(error.retryable).toBe(true);
      });

      it('should create non-retryable unknown error', () => {
        const error = ErrorHandler.createChatError('unknown');
        expect(error.type).toBe('unknown');
        expect(error.message).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
        expect(error.retryable).toBe(false);
      });
    });

    describe('handleApiError', () => {
      it('should handle 413 status code', () => {
        const error = { status: 413 };
        const result = ErrorHandler.handleApiError(error, 'upload');
        expect(result.message).toBe(ERROR_MESSAGES.FILE_TOO_LARGE);
        expect(result.retryable).toBe(false);
        expect(result.type).toBe('file-too-large');
      });

      it('should handle 429 status code', () => {
        const error = { status: 429 };
        const result = ErrorHandler.handleApiError(error, 'chat');
        expect(result.message).toBe(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
        expect(result.retryable).toBe(true);
        expect(result.type).toBe('rate-limit');
      });

      it('should handle 408 timeout', () => {
        const error = { status: 408 };
        const result = ErrorHandler.handleApiError(error, 'chat');
        expect(result.message).toBe(ERROR_MESSAGES.REQUEST_TIMEOUT);
        expect(result.retryable).toBe(true);
        expect(result.type).toBe('timeout');
      });

      it('should handle 500 server error for upload', () => {
        const error = { status: 500 };
        const result = ErrorHandler.handleApiError(error, 'upload');
        expect(result.message).toBe(ERROR_MESSAGES.PROCESSING_FAILED);
        expect(result.retryable).toBe(true);
        expect(result.type).toBe('server-error');
      });

      it('should handle 500 server error for chat', () => {
        const error = { status: 500 };
        const result = ErrorHandler.handleApiError(error, 'chat');
        expect(result.message).toBe(ERROR_MESSAGES.AI_SERVICE_UNAVAILABLE);
        expect(result.retryable).toBe(true);
        expect(result.type).toBe('server-error');
      });

      it('should handle network errors', () => {
        const error = { code: 'ECONNRESET' };
        const result = ErrorHandler.handleApiError(error, 'chat');
        expect(result.message).toBe(ERROR_MESSAGES.NETWORK_CONNECTION);
        expect(result.retryable).toBe(true);
        expect(result.type).toBe('network-error');
      });

      it('should handle OpenAI quota errors', () => {
        const error = { code: 'insufficient_quota' };
        const result = ErrorHandler.handleApiError(error, 'chat');
        expect(result.message).toBe(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
        expect(result.retryable).toBe(true);
        expect(result.type).toBe('rate-limit');
      });

      it('should handle OpenAI API key errors', () => {
        const error = { code: 'invalid_api_key' };
        const result = ErrorHandler.handleApiError(error, 'chat');
        expect(result.message).toBe(ERROR_MESSAGES.INVALID_API_KEY);
        expect(result.retryable).toBe(false);
        expect(result.type).toBe('auth-error');
      });

      it('should handle context length errors', () => {
        const error = { code: 'context_length_exceeded' };
        const result = ErrorHandler.handleApiError(error, 'chat');
        expect(result.message).toBe(ERROR_MESSAGES.CONTEXT_TOO_LONG);
        expect(result.retryable).toBe(false);
        expect(result.type).toBe('context-error');
      });

      it('should return unknown error for unhandled cases', () => {
        const error = { status: 999 };
        const result = ErrorHandler.handleApiError(error, 'chat');
        expect(result.message).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
        expect(result.retryable).toBe(true);
        expect(result.type).toBe('unknown');
      });
    });

    describe('retry utilities', () => {
      it('should determine if error is retryable', () => {
        const retryableError = { retryable: true };
        const nonRetryableError = { retryable: false };
        
        expect(ErrorHandler.isRetryableError(retryableError)).toBe(true);
        expect(ErrorHandler.isRetryableError(nonRetryableError)).toBe(false);
      });

      it('should determine if should retry based on count', () => {
        const error = { retryable: true };
        
        expect(ErrorHandler.shouldRetry(error, 0, 3)).toBe(true);
        expect(ErrorHandler.shouldRetry(error, 2, 3)).toBe(true);
        expect(ErrorHandler.shouldRetry(error, 3, 3)).toBe(false);
        expect(ErrorHandler.shouldRetry(error, 4, 3)).toBe(false);
      });

      it('should calculate retry delay with exponential backoff', () => {
        expect(ErrorHandler.getRetryDelay(0)).toBe(1000);
        expect(ErrorHandler.getRetryDelay(1)).toBe(2000);
        expect(ErrorHandler.getRetryDelay(2)).toBe(4000);
        expect(ErrorHandler.getRetryDelay(3)).toBe(8000);
        expect(ErrorHandler.getRetryDelay(4)).toBe(10000); // Max delay
      });
    });
  });

  describe('ValidationUtils', () => {
    describe('validateFile', () => {
      it('should validate valid PDF file', () => {
        const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
        const result = ValidationUtils.validateFile(file);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should reject non-PDF file', () => {
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        const result = ValidationUtils.validateFile(file);
        expect(result.isValid).toBe(false);
        expect(result.error?.type).toBe('invalid-file-type');
        expect(result.error?.message).toBe(ERROR_MESSAGES.INVALID_FILE_TYPE);
      });

      it('should reject oversized file', () => {
        const file = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
        const result = ValidationUtils.validateFile(file);
        expect(result.isValid).toBe(false);
        expect(result.error?.type).toBe('file-too-large');
        expect(result.error?.message).toBe(ERROR_MESSAGES.FILE_TOO_LARGE);
      });
    });

    describe('validateMessage', () => {
      it('should validate valid message', () => {
        const result = ValidationUtils.validateMessage('Hello, how are you?');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should reject empty message', () => {
        const result = ValidationUtils.validateMessage('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Message cannot be empty');
      });

      it('should reject whitespace-only message', () => {
        const result = ValidationUtils.validateMessage('   ');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Message cannot be empty');
      });

      it('should reject overly long message', () => {
        const longMessage = 'x'.repeat(1001);
        const result = ValidationUtils.validateMessage(longMessage);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Message too long. Please keep your question under 1000 characters.');
      });

      it('should reject non-string message', () => {
        const result = ValidationUtils.validateMessage(null as any);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Message is required');
      });
    });

    describe('validateDocumentText', () => {
      it('should validate valid document text', () => {
        const result = ValidationUtils.validateDocumentText('This is a valid document.');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should reject empty document text', () => {
        const result = ValidationUtils.validateDocumentText('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Document text is empty. Please upload a valid PDF document.');
      });

      it('should reject overly long document text', () => {
        const longText = 'x'.repeat(1000001);
        const result = ValidationUtils.validateDocumentText(longText);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.DOCUMENT_TOO_LONG);
      });
    });
  });

  describe('RetryUtils', () => {
    it('should succeed on first attempt', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const result = await RetryUtils.withRetry(operation);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry and succeed', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success');
      
      const onRetry = jest.fn();
      const result = await RetryUtils.withRetry(operation, 3, onRetry);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
    });

    it('should fail after max retries', async () => {
      const error = new Error('Persistent error');
      const operation = jest.fn().mockRejectedValue(error);
      
      await expect(RetryUtils.withRetry(operation, 2)).rejects.toThrow('Persistent error');
      expect(operation).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should not retry non-retryable errors', async () => {
      const error = { status: 400, message: 'Bad request' };
      const operation = jest.fn().mockRejectedValue(error);
      
      await expect(RetryUtils.withRetry(operation, 3)).rejects.toEqual(error);
      expect(operation).toHaveBeenCalledTimes(1); // No retries
    });
  });
}); 