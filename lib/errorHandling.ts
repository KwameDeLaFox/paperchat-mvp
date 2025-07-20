// Centralized error handling utilities

export interface AppError {
  message: string;
  retryable: boolean;
  type?: string;
  code?: string;
}

export interface UploadError {
  type: 'file-too-large' | 'invalid-file-type' | 'upload-failed' | 'processing-failed' | 'network-error';
  message: string;
  retryable: boolean;
}

export interface ChatError {
  type: 'api' | 'network' | 'timeout' | 'rate-limit' | 'unknown';
  message: string;
  retryable: boolean;
}

// Standard error messages
export const ERROR_MESSAGES = {
  // Upload errors
  FILE_TOO_LARGE: 'File too large. Maximum size is 10MB.',
  INVALID_FILE_TYPE: 'Please upload a PDF file. Only PDF files are supported.',
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  PROCESSING_FAILED: 'Unable to process this PDF. The file might be corrupted or password-protected. Try a different file.',
  NETWORK_ERROR: 'Network error. Please check your internet connection and try again.',
  EMPTY_PDF: 'Unable to extract text from this PDF. The file might be empty or contain only images.',
  PASSWORD_PROTECTED: 'This PDF is password-protected. Please remove the password and try again.',
  CORRUPTED_PDF: 'Unable to read this PDF. The file might be corrupted. Try a different file.',
  DOCUMENT_TOO_LONG: 'This document is quite long. For best results, try asking specific questions about smaller sections.',
  
  // Chat errors
  AI_SERVICE_UNAVAILABLE: 'AI service temporarily unavailable. Please try again later.',
  RATE_LIMIT_EXCEEDED: 'AI service is busy. Please wait a moment and try again.',
  REQUEST_TIMEOUT: 'Request timed out. This document might be too long. Try asking a more specific question.',
  INVALID_API_KEY: 'Invalid API key. Please check your OpenAI configuration.',
  CONTEXT_TOO_LONG: 'This document is quite long. For best results, try asking specific questions about smaller sections.',
  NETWORK_CONNECTION: 'Network error. Please check your internet connection and try again.',
  INVALID_REQUEST: 'Invalid request. Please try rephrasing your question.',
  MAX_RETRIES_REACHED: 'Maximum retry attempts reached. Please try asking a different question.',
  
  // Demo errors
  DEMO_UNAVAILABLE: 'Demo service temporarily unavailable. Please try again later.',
  DEMO_LOAD_FAILED: 'Failed to load demo document. Please try again.',
  DEMO_EMPTY: 'Demo document is empty. Please try uploading your own PDF.',
  
  // Generic errors
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  RETRY_LATER: 'Please try again later.',
} as const;

// Error handling utilities
export class ErrorHandler {
  static createUploadError(type: UploadError['type'], customMessage?: string): UploadError {
    const messages = {
      'file-too-large': ERROR_MESSAGES.FILE_TOO_LARGE,
      'invalid-file-type': ERROR_MESSAGES.INVALID_FILE_TYPE,
      'upload-failed': ERROR_MESSAGES.UPLOAD_FAILED,
      'processing-failed': ERROR_MESSAGES.PROCESSING_FAILED,
      'network-error': ERROR_MESSAGES.NETWORK_ERROR,
    };

    const retryable = type === 'upload-failed' || type === 'processing-failed' || type === 'network-error';
    
    return {
      type,
      message: customMessage || messages[type],
      retryable,
    };
  }

  static createChatError(type: ChatError['type'], customMessage?: string): ChatError {
    const messages = {
      'api': ERROR_MESSAGES.AI_SERVICE_UNAVAILABLE,
      'network': ERROR_MESSAGES.NETWORK_CONNECTION,
      'timeout': ERROR_MESSAGES.REQUEST_TIMEOUT,
      'rate-limit': ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
      'unknown': ERROR_MESSAGES.UNKNOWN_ERROR,
    };

    const retryable = type !== 'unknown';
    
    return {
      type,
      message: customMessage || messages[type],
      retryable,
    };
  }

  static handleApiError(error: any, context: 'upload' | 'chat' | 'demo' = 'chat'): AppError {
    console.error(`${context} API error:`, error);

    // Handle specific HTTP status codes
    if (error.status === 413) {
      return {
        message: ERROR_MESSAGES.FILE_TOO_LARGE,
        retryable: false,
        type: 'file-too-large',
      };
    }

    if (error.status === 400) {
      return {
        message: error.message || ERROR_MESSAGES.INVALID_REQUEST,
        retryable: false,
        type: 'invalid-request',
      };
    }

    if (error.status === 401) {
      return {
        message: ERROR_MESSAGES.INVALID_API_KEY,
        retryable: false,
        type: 'auth-error',
      };
    }

    if (error.status === 429) {
      return {
        message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
        retryable: true,
        type: 'rate-limit',
      };
    }

    if (error.status === 408 || error.status === 504) {
      return {
        message: ERROR_MESSAGES.REQUEST_TIMEOUT,
        retryable: true,
        type: 'timeout',
      };
    }

    if (error.status >= 500) {
      return {
        message: context === 'upload' ? ERROR_MESSAGES.PROCESSING_FAILED : ERROR_MESSAGES.AI_SERVICE_UNAVAILABLE,
        retryable: true,
        type: 'server-error',
      };
    }

    // Handle network errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      return {
        message: ERROR_MESSAGES.NETWORK_CONNECTION,
        retryable: true,
        type: 'network-error',
      };
    }

    // Handle OpenAI specific errors
    if (error.code === 'insufficient_quota') {
      return {
        message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
        retryable: true,
        type: 'rate-limit',
      };
    }

    if (error.code === 'invalid_api_key') {
      return {
        message: ERROR_MESSAGES.INVALID_API_KEY,
        retryable: false,
        type: 'auth-error',
      };
    }

    if (error.code === 'context_length_exceeded') {
      return {
        message: ERROR_MESSAGES.CONTEXT_TOO_LONG,
        retryable: false,
        type: 'context-error',
      };
    }

    // Default error
    return {
      message: ERROR_MESSAGES.UNKNOWN_ERROR,
      retryable: true,
      type: 'unknown',
    };
  }

  static isRetryableError(error: AppError): boolean {
    return error.retryable;
  }

  static shouldRetry(error: AppError, retryCount: number, maxRetries: number = 3): boolean {
    return error.retryable && retryCount < maxRetries;
  }

  static getRetryDelay(retryCount: number): number {
    // Exponential backoff: 1s, 2s, 4s
    return Math.min(1000 * Math.pow(2, retryCount), 10000);
  }
}

// Validation utilities
export class ValidationUtils {
  static validateFile(file: File): { isValid: boolean; error?: UploadError } {
    // Check file type
    if (file.type !== 'application/pdf') {
      return {
        isValid: false,
        error: ErrorHandler.createUploadError('invalid-file-type'),
      };
    }

    // Check file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: ErrorHandler.createUploadError('file-too-large'),
      };
    }

    return { isValid: true };
  }

  static validateMessage(message: string): { isValid: boolean; error?: string } {
    if (!message || typeof message !== 'string') {
      return {
        isValid: false,
        error: 'Message is required',
      };
    }

    if (message.trim().length === 0) {
      return {
        isValid: false,
        error: 'Message cannot be empty',
      };
    }

    if (message.length > 1000) {
      return {
        isValid: false,
        error: 'Message too long. Please keep your question under 1000 characters.',
      };
    }

    return { isValid: true };
  }

  static validateDocumentText(text: string): { isValid: boolean; error?: string } {
    if (!text || typeof text !== 'string') {
      return {
        isValid: false,
        error: 'Document text is required',
      };
    }

    if (text.trim().length === 0) {
      return {
        isValid: false,
        error: 'Document text is empty. Please upload a valid PDF document.',
      };
    }

    if (text.length > 1000000) { // 1MB of text
      return {
        isValid: false,
        error: ERROR_MESSAGES.DOCUMENT_TOO_LONG,
      };
    }

    return { isValid: true };
  }
}

// Retry utilities
export class RetryUtils {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    onRetry?: (retryCount: number, error: any) => void
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }

        const appError = ErrorHandler.handleApiError(error);
        if (!ErrorHandler.shouldRetry(appError, attempt, maxRetries)) {
          throw error;
        }

        onRetry?.(attempt + 1, error);
        
        // Wait before retrying
        const delay = ErrorHandler.getRetryDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
} 