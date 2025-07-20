'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, FileImage, Loader2, RefreshCw } from 'lucide-react';

interface PDFViewerProps {
  documentInfo: {
    text: string;
    type: string;
    url?: string;
    pdfUrl?: string;
  };
}

const PDFViewer: React.FC<PDFViewerProps> = ({ documentInfo }) => {
  const [viewMode, setViewMode] = useState<'pdf' | 'text'>('pdf');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get PDF URL - use uploaded PDF if available, otherwise fall back to sample PDF
  const pdfUrl = documentInfo.pdfUrl || documentInfo.url || '/api/sample-pdf';

  const handleIframeLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setError('Failed to load PDF. Please try again.');
    setLoading(false);
  };

  if (viewMode === 'text') {
    return (
      <div className="h-full flex flex-col min-w-0">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50 flex-shrink-0">
          <h3 className="text-lg font-semibold text-foreground">Document Text</h3>
          <Button
            onClick={() => setViewMode('pdf')}
            variant="outline"
            size="sm"
          >
            <FileImage className="h-4 w-4 mr-2" />
            Switch to PDF View
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-6 min-w-0">
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed break-words text-foreground">
              {documentInfo.text}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-w-0">
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50 flex-shrink-0">
        <div className="flex items-center space-x-4 min-w-0">
          <h3 className="text-lg font-semibold truncate text-foreground">PDF Viewer</h3>
          
          {/* PDF Info */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-sm text-muted-foreground">
              Document loaded
            </span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <Button
          onClick={() => setViewMode('text')}
          variant="outline"
          size="sm"
        >
          <FileText className="h-4 w-4 mr-2" />
          Switch to Text View
        </Button>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-hidden bg-muted/30 min-w-0 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading PDF...</p>
              <p className="text-xs text-muted-foreground mt-2">URL: {pdfUrl}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        <iframe
          src={pdfUrl}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title="PDF Document"
        />
      </div>
    </div>
  );
};

export default PDFViewer; 