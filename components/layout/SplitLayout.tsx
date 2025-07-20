import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare } from 'lucide-react';
import PDFViewer from '@/components/pdf/PDFViewer';

interface SplitLayoutProps {
  children: React.ReactNode;
  documentInfo?: {
    text: string;
    type: string;
    url?: string;
    pdfUrl?: string;
  };
}

const SplitLayout: React.FC<SplitLayoutProps> = ({ children, documentInfo }) => {
  return (
    <div className="h-screen bg-muted/30 flex overflow-hidden">
      {/* Left */}
      <div className="bg-background overflow-hidden min-w-0 w-1/2">
        {documentInfo ? (
          <PDFViewer documentInfo={documentInfo} />
        ) : (
          <Card className="h-full rounded-none border-0 overflow-hidden">
            <CardHeader className="border-b border-border bg-muted/50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      Document Viewer
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        0 pages
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-full overflow-auto">
              <div className="p-6">
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No document loaded</h3>
                  <p className="text-sm">Upload a PDF or try demo mode to view document content.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Splitter */}
      <div className="splitter flex-shrink-0">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-0.5 h-8 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      {/* Right */}
      <div className="bg-background overflow-hidden min-w-0 w-1/2">
        <Card className="h-full rounded-none border-0 overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/50 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg font-semibold text-foreground">
                Chat with Document
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SplitLayout; 