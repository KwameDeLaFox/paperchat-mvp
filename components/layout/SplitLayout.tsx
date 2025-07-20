import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare } from 'lucide-react';

interface SplitLayoutProps {
  children: React.ReactNode;
  documentInfo?: {
    filename: string;
    pages: number;
    isDemo?: boolean;
  };
}

const SplitLayout: React.FC<SplitLayoutProps> = ({ children, documentInfo }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* PDF Viewer Section */}
      <div className="w-2/3 border-r border-gray-200 bg-white">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-600" />
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {documentInfo?.filename || 'Document Viewer'}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {documentInfo?.pages || 0} pages
                    </Badge>
                    {documentInfo?.isDemo && (
                      <Badge variant="outline" className="text-xs">
                        Demo Mode
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-full overflow-auto">
            <div className="p-6">
              {/* PDF content will be rendered here */}
              <div className="prose max-w-none">
                <p className="text-gray-600">
                  Document content will be displayed here...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface Section */}
      <div className="w-1/3 flex flex-col bg-white">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">
                Chat with Document
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SplitLayout; 