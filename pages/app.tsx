import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import FileUpload from '@/components/upload/FileUpload';
import SplitLayout from '@/components/layout/SplitLayout';
import ChatInterface from '@/components/chat/ChatInterface';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface DocumentInfo {
  text: string;
  filename: string;
  pages: number;
  type: string;
  isDemo?: boolean;
  pdfUrl?: string;
}

interface AppError {
  message: string;
  retryable: boolean;
}

export default function App() {
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  // Check for demo parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
      handleDemoMode();
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  const handleFileUpload = (text: string, pdfUrl?: string, filename?: string, pages?: number) => {
    setDocumentInfo({
      text,
      filename: filename || 'Uploaded Document',
      pages: pages || Math.ceil(text.length / 2000), // Rough estimate
      type: 'pdf',
      isDemo: false,
      pdfUrl
    });
    clearError();
  };

  const handleUploadError = (errorMessage: string) => {
    setError({
      message: errorMessage,
      retryable: true
    });
  };

  const handleDemoMode = async () => {
    setIsLoadingDemo(true);
    clearError();

    try {
      const response = await fetch('/api/sample');
      
      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('Demo service temporarily unavailable. Please try again later.');
        } else {
          throw new Error('Failed to load demo document. Please try again.');
        }
      }

      const result = await response.json();
      
      if (result.text && result.text.trim()) {
        setDocumentInfo({
          text: result.text,
          filename: result.filename || 'Sample Document',
          pages: result.pages || 1,
          type: 'pdf',
          isDemo: true
        });
      } else {
        throw new Error('Demo document is empty. Please try uploading your own PDF.');
      }
    } catch (error) {
      console.error('Failed to load demo document:', error);
      setError({
        message: error instanceof Error ? error.message : 'Failed to load demo document',
        retryable: true
      });
    } finally {
      setIsLoadingDemo(false);
    }
  };

  const handleRetryDemo = () => {
    handleDemoMode();
  };

  // Show file upload if no document is loaded
  if (!documentInfo) {
    return (
      <>
        <Head>
          <title>PaperChat - Upload & Chat</title>
          <meta name="description" content="Upload your PDF and start chatting with AI" />
        </Head>
        
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                PaperChat
              </h1>
              <p className="text-muted-foreground">
                Upload a PDF to start chatting with your document
              </p>
            </div>

            {error && (
              <Alert className="mb-4 border-destructive/20 bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  <div className="flex items-center justify-between">
                    <span>{error.message}</span>
                    {error.retryable && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetryDemo}
                        className="ml-2 h-8 px-3 text-xs"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <FileUpload 
              onFileUpload={handleFileUpload}
              onError={handleUploadError}
            />

            <div className="text-center mt-6">
              <Button 
                onClick={handleDemoMode}
                variant="outline"
                size="sm"
                disabled={isLoadingDemo}
                className="mb-2"
              >
                {isLoadingDemo ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                    Loading Demo...
                  </>
                ) : (
                  'Try Demo Mode'
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Test with a sample document
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show split layout with document loaded
  return (
    <>
      <Head>
        <title>PaperChat - {documentInfo.filename}</title>
        <meta name="description" content="Chat with your PDF document" />
      </Head>
      
      <SplitLayout documentInfo={documentInfo}>
        <ChatInterface documentText={documentInfo.text} />
      </SplitLayout>
    </>
  );
} 