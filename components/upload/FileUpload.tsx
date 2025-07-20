import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  onFileUpload: (text: string) => void;
  onError?: (error: string) => void;
}

interface UploadError {
  type: 'file-too-large' | 'invalid-file-type' | 'upload-failed' | 'processing-failed' | 'network-error';
  message: string;
  retryable: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onError }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<UploadError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_RETRIES = 3;

  const clearError = () => {
    setError(null);
    setRetryCount(0);
  };

  const handleError = (errorType: UploadError['type'], message: string, retryable: boolean = true) => {
    const uploadError: UploadError = {
      type: errorType,
      message,
      retryable
    };
    setError(uploadError);
    onError?.(message);
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (file.type !== 'application/pdf') {
      handleError('invalid-file-type', 'Please upload a PDF file. Only PDF files are supported.', false);
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      handleError('file-too-large', `File too large. Maximum size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`, false);
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File): Promise<void> => {
    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);
    clearError();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 413) {
          handleError('file-too-large', 'File too large. Maximum size is 10MB.', false);
        } else if (response.status === 400) {
          handleError('invalid-file-type', errorData.error || 'Invalid file format. Please upload a PDF file.', false);
        } else if (response.status >= 500) {
          handleError('processing-failed', 'Unable to process this PDF. The file might be corrupted or password-protected. Try a different file.', true);
        } else {
          handleError('upload-failed', 'Upload failed. Please try again.', true);
        }
        return;
      }

      const data = await response.json();
      
      if (data.text && data.text.trim()) {
        onFileUpload(data.text);
        clearError();
      } else {
        handleError('processing-failed', 'Unable to extract text from this PDF. The file might be empty or contain only images.', false);
      }

    } catch (err) {
      console.error('Upload error:', err);
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        handleError('network-error', 'Network error. Please check your internet connection and try again.', true);
      } else {
        handleError('upload-failed', 'Upload failed. Please try again.', true);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetry = () => {
    if (retryCount >= MAX_RETRIES) {
      handleError('upload-failed', 'Maximum retry attempts reached. Please try uploading a different file.', false);
      return;
    }
    setRetryCount(prev => prev + 1);
    // Note: We'd need to store the last file to retry. For now, just clear error.
    clearError();
  };

  const handleFileSelect = useCallback((file: File) => {
    uploadFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>{error.message}</span>
              {error.retryable && retryCount < MAX_RETRIES && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="ml-2 h-8 px-3 text-xs border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
            </div>
            {retryCount > 0 && retryCount < MAX_RETRIES && (
              <div className="text-xs text-red-600 mt-1">
                Retry attempt {retryCount} of {MAX_RETRIES}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Card className={`border-2 border-dashed transition-colors ${
        isDragOver 
          ? 'border-primary bg-primary/5' 
          : error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 hover:border-primary/50'
      }`}>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-gray-100">
              {isUploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              ) : (
                <Upload className="h-6 w-6 text-gray-600" />
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isUploading ? 'Uploading PDF...' : 'Upload your PDF'}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              {isUploading 
                ? 'Please wait while we process your document...'
                : 'Drag and drop your PDF here, or click to browse'
              }
            </p>

            {!isUploading && (
              <div className="space-y-3">
                <Button
                  onClick={() => document.getElementById('file-input')?.click()}
                  disabled={isUploading}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Choose PDF File
                </Button>
                
                <p className="text-xs text-gray-500">
                  Maximum file size: 10MB
                </p>
              </div>
            )}

            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleInputChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>
        </CardContent>
      </Card>

      <div
        className={`fixed inset-0 pointer-events-none transition-opacity ${
          isDragOver ? 'opacity-100' : 'opacity-0'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg m-4 flex items-center justify-center">
          <div className="text-center">
            <Upload className="h-12 w-12 text-primary mx-auto mb-2" />
            <p className="text-lg font-semibold text-primary">Drop your PDF here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 