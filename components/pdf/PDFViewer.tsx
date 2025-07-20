import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SearchBar from './SearchBar';

interface SearchResult {
  id: number;
  text: string;
  index: number;
  paragraphIndex: number;
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedParagraph, setHighlightedParagraph] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const handleSearch = (query: string): SearchResult[] => {
    if (!query.trim()) return [];
    
    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();
    
    paragraphs.forEach((paragraph, paragraphIndex) => {
      const text = paragraph.text.toLowerCase();
      let index = text.indexOf(searchTerm);
      
      while (index !== -1) {
        results.push({
          id: results.length,
          text: paragraph.text.substring(index, index + query.length),
          index: index,
          paragraphIndex: paragraphIndex
        });
        index = text.indexOf(searchTerm, index + 1);
      }
    });
    
    return results;
  };

  const handleResultSelect = (result: SearchResult) => {
    setHighlightedParagraph(result.paragraphIndex);
    
    // Scroll to the highlighted paragraph
    setTimeout(() => {
      const element = document.getElementById(`paragraph-${result.paragraphIndex}`);
      if (element && contentRef.current) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setHighlightedParagraph(null);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };
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

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        onResultSelect={handleResultSelect}
        onClear={handleClearSearch}
      />

      {/* PDF Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
        {paragraphs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No content available</h3>
            <p className="text-sm">The document appears to be empty or couldn't be processed.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {paragraphs.map((paragraph) => (
              <div 
                key={paragraph.id} 
                id={`paragraph-${paragraph.id}`}
                className={`group transition-colors duration-200 ${
                  highlightedParagraph === paragraph.id 
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 pl-4' 
                    : ''
                }`}
              >
                {paragraph.isHeading ? (
                  <h3 className="text-lg font-semibold text-foreground mb-2 border-b border-border pb-1">
                    {searchQuery ? highlightText(paragraph.text, searchQuery) : paragraph.text}
                  </h3>
                ) : (
                  <p className="text-sm leading-relaxed text-foreground">
                    {searchQuery ? highlightText(paragraph.text, searchQuery) : paragraph.text}
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