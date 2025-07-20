import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileProcessed: (text: string, filename: string, pages: number) => void;
  onDemoMode: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, onDemoMode }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    // Reset error state
    setError(null);
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB)');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Process successful upload
      onFileProcessed(result.text, result.filename, result.pages);
    } catch (err: any) {
      setError(err.message || 'Failed to process PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            PaperChat
          </CardTitle>
          <p className="text-gray-600">
            Upload a PDF to start chatting with your document
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                {isUploading ? 'Processing PDF...' : 'Drop your PDF here'}
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
              
              {!isUploading && (
                <Button 
                  onClick={handleButtonClick}
                  variant="default"
                  size="lg"
                  className="mt-4"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Choose PDF File
                </Button>
              )}
            </div>

            {/* File Requirements */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <Badge variant="outline">Max 10MB</Badge>
                <Badge variant="outline">PDF only</Badge>
              </div>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Demo Mode Button */}
          <div className="text-center">
            <Button 
              onClick={onDemoMode}
              variant="outline"
              size="sm"
              disabled={isUploading}
            >
              Try Demo Mode
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Test with a sample document
            </p>
          </div>

          {/* Loading State */}
          {isUploading && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Extracting text from PDF...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload; 