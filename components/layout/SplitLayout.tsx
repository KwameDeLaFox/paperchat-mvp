import React, { useState, useRef, useEffect } from 'react';
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
  };
}

const SplitLayout: React.FC<SplitLayoutProps> = ({ children, documentInfo }) => {
  const [leftWidth, setLeftWidth] = useState(50); // 50% default
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const splitterRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on splitter
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const startX = e.clientX;
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const startLeftWidth = leftWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = startLeftWidth + deltaPercent;
      
      // Constrain to reasonable bounds (20% - 80%)
      const constrainedWidth = Math.max(20, Math.min(80, newWidth));
      
      // Update CSS directly for smooth dragging
      if (leftPanelRef.current && rightPanelRef.current) {
        leftPanelRef.current.style.width = `${constrainedWidth}%`;
        rightPanelRef.current.style.width = `${100 - constrainedWidth}%`;
      }
    };

    const handleMouseUp = () => {
      // Update React state only when dragging ends
      if (leftPanelRef.current) {
        const finalWidth = parseFloat(leftPanelRef.current.style.width);
        setLeftWidth(finalWidth);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle double click to reset to 50/50
  const handleDoubleClick = () => {
    setLeftWidth(50);
    if (leftPanelRef.current && rightPanelRef.current) {
      leftPanelRef.current.style.width = '50%';
      rightPanelRef.current.style.width = '50%';
    }
  };

  // Update CSS when React state changes
  useEffect(() => {
    if (leftPanelRef.current && rightPanelRef.current) {
      leftPanelRef.current.style.width = `${leftWidth}%`;
      rightPanelRef.current.style.width = `${100 - leftWidth}%`;
    }
  }, [leftWidth]);

  return (
    <div 
      ref={containerRef}
      className="flex h-screen bg-muted/30 overflow-hidden"
    >
      {/* PDF Viewer Section */}
      <div 
        ref={leftPanelRef}
        className="border-r border-border bg-background overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
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

      {/* Draggable Splitter */}
      <div
        ref={splitterRef}
        className="w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize relative transition-colors"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        title="Drag to resize • Double-click to reset to 50/50"
      >
        {/* Splitter handle */}
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
          <div className="w-1 h-8 bg-gray-400 rounded-full hover:bg-blue-500 transition-colors"></div>
        </div>
      </div>

      {/* Chat Interface Section */}
      <div 
        ref={rightPanelRef}
        className="flex flex-col bg-background overflow-hidden"
        style={{ width: `${100 - leftWidth}%` }}
      >
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