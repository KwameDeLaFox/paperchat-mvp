import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

interface SearchResult {
  id: number;
  text: string;
  index: number;
  paragraphIndex: number;
}

interface SearchBarProps {
  onSearch: (query: string) => SearchResult[];
  onResultSelect: (result: SearchResult) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onResultSelect, onClear }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setCurrentIndex(0);
      onClear();
      return;
    }

    setIsSearching(true);
    const searchResults = onSearch(searchQuery);
    setResults(searchResults);
    setCurrentIndex(0);
    setIsSearching(false);

    if (searchResults.length > 0) {
      onResultSelect(searchResults[0]);
    }
  };

  const handleNext = () => {
    if (results.length === 0) return;
    const nextIndex = (currentIndex + 1) % results.length;
    setCurrentIndex(nextIndex);
    onResultSelect(results[nextIndex]);
  };

  const handlePrevious = () => {
    if (results.length === 0) return;
    const prevIndex = currentIndex === 0 ? results.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    onResultSelect(results[prevIndex]);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setCurrentIndex(0);
    onClear();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        handleSearch(query);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="flex items-center space-x-2 p-4 border-b border-border bg-muted/30">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search in document..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {results.length > 0 && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            className="h-8 w-8 p-0"
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          
          <Badge variant="secondary" className="text-xs">
            {currentIndex + 1} of {results.length}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="h-8 w-8 p-0"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      )}

      {isSearching && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-xs text-muted-foreground">Searching...</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 