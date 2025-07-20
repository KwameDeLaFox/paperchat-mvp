import React, { useState } from 'react';
import FileUpload from '@/components/upload/FileUpload';
import SplitLayout from '@/components/layout/SplitLayout';
import ChatInterface from '@/components/chat/ChatInterface';

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
      <ChatInterface documentText={documentInfo.text} />
    </SplitLayout>
  );
} 