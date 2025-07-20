import React from 'react';
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
  BookOpen
} from 'lucide-react';

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  documentType?: 'research' | 'manual' | 'report' | 'article' | 'general';
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ 
  onSuggestionClick, 
  documentType = 'general' 
}) => {
  // Different suggestion sets based on document type
  const getSuggestions = () => {
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

  const suggestions = getSuggestions();

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