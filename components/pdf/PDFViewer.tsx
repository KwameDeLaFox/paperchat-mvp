'use client';

import React, { useState } from 'react';

interface PDFViewerProps {
  documentInfo: {
    text: string;
    type: string;
    url?: string;
  };
}

const PDFViewer: React.FC<PDFViewerProps> = ({ documentInfo }) => {
  const [viewMode, setViewMode] = useState<'pdf' | 'text'>('pdf');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get PDF URL - use sample PDF for demo, or actual URL if provided
  const pdfUrl = documentInfo.url || '/api/sample-pdf';

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
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-semibold">Document Text</h3>
          <button
            onClick={() => setViewMode('pdf')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Switch to PDF View
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6 min-w-0">
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed break-words">
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
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 flex-shrink-0">
        <div className="flex items-center space-x-4 min-w-0">
          <h3 className="text-lg font-semibold truncate">PDF Viewer</h3>
          
          {/* PDF Info */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-sm text-gray-600">
              Document loaded
            </span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <button
          onClick={() => setViewMode('text')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-shrink-0 text-sm"
        >
          Switch to Text View
        </button>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-hidden bg-gray-100 min-w-0 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF...</p>
              <p className="text-xs text-gray-500 mt-2">URL: {pdfUrl}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
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