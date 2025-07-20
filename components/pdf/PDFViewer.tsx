import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PDFViewerProps {
  documentText: string;
  filename: string;
  pages: number;
  isDemo?: boolean;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ 
  documentText, 
  filename, 
  pages, 
  isDemo = false 
}) => {
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(documentText);
      // You could add a toast notification here
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadText = () => {
    const blob = new Blob([documentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace('.pdf', '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Split text into paragraphs for better display
  const paragraphs = documentText
    .split('\n')
    .filter(paragraph => paragraph.trim().length > 0)
    .map((paragraph, index) => ({
      id: index,
      text: paragraph.trim(),
      isHeading: paragraph.trim().length < 100 && 
                 (paragraph.trim().endsWith(':') || 
                  paragraph.trim().toUpperCase() === paragraph.trim())
    }));

  return (
    <div className="h-full flex flex-col">
      {/* Header with actions */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">{filename}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {pages} pages
              </Badge>
              {isDemo && (
                <Badge variant="outline" className="text-xs">
                  Demo Mode
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyText}
            className="h-8 px-3"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadText}
            className="h-8 px-3"
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {paragraphs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No content available</h3>
            <p className="text-sm">The document appears to be empty or couldn't be processed.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {paragraphs.map((paragraph) => (
              <div key={paragraph.id} className="group">
                {paragraph.isHeading ? (
                  <h3 className="text-lg font-semibold text-foreground mb-2 border-b border-border pb-1">
                    {paragraph.text}
                  </h3>
                ) : (
                  <p className="text-sm leading-relaxed text-foreground">
                    {paragraph.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with document info */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {paragraphs.length} paragraphs • {documentText.length.toLocaleString()} characters
          </span>
          <span>
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer; 