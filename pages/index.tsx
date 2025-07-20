import React, { useState } from 'react';
import FileUpload from '@/components/upload/FileUpload';
import SplitLayout from '@/components/layout/SplitLayout';

interface DocumentInfo {
  text: string;
  filename: string;
  pages: number;
  isDemo?: boolean;
}

export default function Home() {
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);

  const handleFileProcessed = (text: string, filename: string, pages: number) => {
    setDocumentInfo({
      text,
      filename,
      pages,
      isDemo: false
    });
  };

  const handleDemoMode = async () => {
    try {
      const response = await fetch('/api/sample');
      const result = await response.json();
      
      if (response.ok) {
        setDocumentInfo({
          text: result.text,
          filename: result.filename,
          pages: result.pages,
          isDemo: true
        });
      }
    } catch (error) {
      console.error('Failed to load demo document:', error);
    }
  };

  // Show file upload if no document is loaded
  if (!documentInfo) {
    return (
      <FileUpload 
        onFileProcessed={handleFileProcessed}
        onDemoMode={handleDemoMode}
      />
    );
  }

  // Show split layout with document loaded
  return (
    <SplitLayout documentInfo={documentInfo}>
      <div className="flex flex-col h-full">
        {/* Chat messages will go here */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-center text-gray-500">
            <p>Chat interface coming in next milestone...</p>
            <p className="text-sm mt-2">
              Document: {documentInfo.filename} ({documentInfo.pages} pages)
            </p>
          </div>
        </div>
        
        {/* Chat input will go here */}
        <div className="border-t border-gray-200 p-4">
          <div className="text-center text-gray-500">
            <p>Chat input coming in next milestone...</p>
          </div>
        </div>
      </div>
    </SplitLayout>
  );
} 