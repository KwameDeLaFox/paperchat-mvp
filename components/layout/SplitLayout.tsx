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
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const splitterRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on splitter
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.classList.add('no-select');
  };

  // Handle double click to reset to 50/50
  const handleDoubleClick = () => {
    setLeftWidth(50);
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Constrain to reasonable bounds (20% - 80%)
      const constrainedWidth = Math.max(20, Math.min(80, newLeftWidth));
      setLeftWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.classList.remove('no-select');
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    document.body.classList.add('no-select');
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      const touch = e.touches[0];
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((touch.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Constrain to reasonable bounds (20% - 80%)
      const constrainedWidth = Math.max(20, Math.min(80, newLeftWidth));
      setLeftWidth(constrainedWidth);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.body.classList.remove('no-select');
    };

    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="flex h-screen bg-muted/30 overflow-hidden"
      style={{ cursor: isDragging ? 'col-resize' : 'default' }}
    >
      {/* PDF Viewer Section */}
      <div 
        className={`border-r border-border bg-background overflow-hidden panel-resize ${isDragging ? 'dragging' : ''}`}
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
        className={`w-1 splitter cursor-col-resize relative ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleDoubleClick}
        title="Drag to resize • Double-click to reset to 50/50"
      >
        {/* Splitter handle */}
        <div className="splitter-handle"></div>
        
        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute inset-y-0 -left-1 -right-1 bg-primary opacity-20"></div>
        )}
      </div>

      {/* Chat Interface Section */}
      <div 
        className={`flex flex-col bg-background overflow-hidden panel-resize ${isDragging ? 'dragging' : ''}`}
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