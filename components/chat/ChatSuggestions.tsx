import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Search, 
  Lightbulb, 
  HelpCircle, 
  BarChart3, 
  Quote,
  Calendar,
  Users,
  Target,
  BookOpen,
  Loader2
} from 'lucide-react';

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  documentText: string;
  documentType?: 'research' | 'manual' | 'report' | 'article' | 'general';
}

interface Suggestion {
  icon: React.ReactNode;
  text: string;
  color: string;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ 
  onSuggestionClick, 
  documentText,
  documentType = 'general' 
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate contextual suggestions based on document content
  const generateContextualSuggestions = async () => {
    if (!documentText || documentText.length < 50) {
      // Fallback to generic suggestions for very short documents
      setSuggestions(getGenericSuggestions());
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentText: documentText.substring(0, 2000), // Limit to first 2000 chars for efficiency
          documentType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }

      const data = await response.json();
      
      if (data.suggestions && data.suggestions.length > 0) {
        // Convert AI suggestions to our format
        const contextualSuggestions = data.suggestions.map((suggestion: string, index: number) => ({
          icon: getIconForSuggestion(suggestion, index),
          text: suggestion,
          color: getColorForIndex(index)
        }));
        setSuggestions(contextualSuggestions);
      } else {
        // Fallback to generic suggestions
        setSuggestions(getGenericSuggestions());
      }
    } catch (err) {
      console.error('Failed to generate contextual suggestions:', err);
      setError('Could not generate suggestions');
      // Fallback to generic suggestions
      setSuggestions(getGenericSuggestions());
    } finally {
      setIsLoading(false);
    }
  };

  // Get icon based on suggestion content
  const getIconForSuggestion = (suggestion: string, index: number): React.ReactNode => {
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (lowerSuggestion.includes('conclusion') || lowerSuggestion.includes('findings')) {
      return <BarChart3 className="h-4 w-4" />;
    }
    if (lowerSuggestion.includes('safety') || lowerSuggestion.includes('risk')) {
      return <HelpCircle className="h-4 w-4" />;
    }
    if (lowerSuggestion.includes('method') || lowerSuggestion.includes('study')) {
      return <Search className="h-4 w-4" />;
    }
    if (lowerSuggestion.includes('effect') || lowerSuggestion.includes('impact')) {
      return <Target className="h-4 w-4" />;
    }
    if (lowerSuggestion.includes('author') || lowerSuggestion.includes('researcher')) {
      return <Users className="h-4 w-4" />;
    }
    if (lowerSuggestion.includes('summary') || lowerSuggestion.includes('overview')) {
      return <FileText className="h-4 w-4" />;
    }
    if (lowerSuggestion.includes('evidence') || lowerSuggestion.includes('data')) {
      return <Quote className="h-4 w-4" />;
    }
    if (lowerSuggestion.includes('recommendation') || lowerSuggestion.includes('advice')) {
      return <Lightbulb className="h-4 w-4" />;
    }
    
    // Default icons based on index
    const defaultIcons = [
      <FileText className="h-4 w-4" />,
      <Search className="h-4 w-4" />,
      <Lightbulb className="h-4 w-4" />,
      <HelpCircle className="h-4 w-4" />
    ];
    
    return defaultIcons[index % defaultIcons.length];
  };

  // Get color based on index
  const getColorForIndex = (index: number): string => {
    const colors = [
      'text-blue-600',
      'text-green-600', 
      'text-yellow-600',
      'text-purple-600',
      'text-orange-600',
      'text-red-600'
    ];
    return colors[index % colors.length];
  };

  // Generic fallback suggestions
  const getGenericSuggestions = (): Suggestion[] => {
    const baseSuggestions = [
      {
        icon: <FileText className="h-4 w-4" />,
        text: "Summarize this document",
        color: "text-blue-600"
      },
      {
        icon: <Search className="h-4 w-4" />,
        text: "What are the main topics?",
        color: "text-green-600"
      },
      {
        icon: <Lightbulb className="h-4 w-4" />,
        text: "What are the key insights?",
        color: "text-yellow-600"
      },
      {
        icon: <HelpCircle className="h-4 w-4" />,
        text: "What questions does this answer?",
        color: "text-purple-600"
      }
    ];

    const researchSuggestions = [
      {
        icon: <BarChart3 className="h-4 w-4" />,
        text: "What are the main findings?",
        color: "text-blue-600"
      },
      {
        icon: <Target className="h-4 w-4" />,
        text: "What was the research objective?",
        color: "text-green-600"
      },
      {
        icon: <Users className="h-4 w-4" />,
        text: "Who conducted this research?",
        color: "text-orange-600"
      },
      {
        icon: <Calendar className="h-4 w-4" />,
        text: "When was this published?",
        color: "text-purple-600"
      }
    ];

    const manualSuggestions = [
      {
        icon: <HelpCircle className="h-4 w-4" />,
        text: "How do I get started?",
        color: "text-blue-600"
      },
      {
        icon: <Target className="h-4 w-4" />,
        text: "What are the requirements?",
        color: "text-green-600"
      },
      {
        icon: <Lightbulb className="h-4 w-4" />,
        text: "What are the best practices?",
        color: "text-yellow-600"
      },
      {
        icon: <Search className="h-4 w-4" />,
        text: "How do I troubleshoot issues?",
        color: "text-red-600"
      }
    ];

    const reportSuggestions = [
      {
        icon: <BarChart3 className="h-4 w-4" />,
        text: "What are the key metrics?",
        color: "text-blue-600"
      },
      {
        icon: <Target className="h-4 w-4" />,
        text: "What are the recommendations?",
        color: "text-green-600"
      },
      {
        icon: <Quote className="h-4 w-4" />,
        text: "What are the main conclusions?",
        color: "text-purple-600"
      },
      {
        icon: <Calendar className="h-4 w-4" />,
        text: "What's the timeline?",
        color: "text-orange-600"
      }
    ];

    const articleSuggestions = [
      {
        icon: <BookOpen className="h-4 w-4" />,
        text: "What's the main argument?",
        color: "text-blue-600"
      },
      {
        icon: <Quote className="h-4 w-4" />,
        text: "What evidence is provided?",
        color: "text-green-600"
      },
      {
        icon: <Users className="h-4 w-4" />,
        text: "Who is the author?",
        color: "text-purple-600"
      },
      {
        icon: <Lightbulb className="h-4 w-4" />,
        text: "What are the implications?",
        color: "text-yellow-600"
      }
    ];

    switch (documentType) {
      case 'research':
        return researchSuggestions;
      case 'manual':
        return manualSuggestions;
      case 'report':
        return reportSuggestions;
      case 'article':
        return articleSuggestions;
      default:
        return baseSuggestions;
    }
  };

  useEffect(() => {
    generateContextualSuggestions();
  }, [documentText, documentType]);

  if (isLoading) {
    return (
      <div className="px-4 py-3">
        <div className="text-xs text-gray-500 mb-3 font-medium">
          Generating suggestions...
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          <span className="text-xs text-gray-500">Analyzing document content...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3">
        <div className="text-xs text-gray-500 mb-3 font-medium">
          Suggested questions:
        </div>
        <div className="text-xs text-gray-400 mb-2">
          {error} - showing general suggestions
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion.text)}
              className="h-auto py-2 px-3 text-xs border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <span className={`mr-2 ${suggestion.color}`}>
                {suggestion.icon}
              </span>
              {suggestion.text}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="text-xs text-gray-500 mb-3 font-medium">
        Suggested questions:
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(suggestion.text)}
            className="h-auto py-2 px-3 text-xs border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <span className={`mr-2 ${suggestion.color}`}>
              {suggestion.icon}
            </span>
            {suggestion.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestions; 