import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  feedback?: 'helpful' | 'unhelpful';
  isError?: boolean;
}

interface MessageProps {
  message: Message;
  onFeedback?: (messageId: string, feedback: 'helpful' | 'unhelpful') => void;
}

const Message: React.FC<MessageProps> = ({ message, onFeedback }) => {
  const isUser = message.sender === 'user';
  const isError = message.isError;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <Card className={`${
          isUser 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : isError
              ? 'bg-red-50 border-red-200 shadow-sm'
              : 'bg-card border shadow-sm'
        }`}>
          <CardContent className="p-3">
            <div className="space-y-2">
              {/* Error icon for error messages */}
              {isError && (
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-medium text-red-700">Error</span>
                </div>
              )}
              
              {/* Message content */}
              <p className={`text-sm whitespace-pre-wrap break-words ${
                isError ? 'text-red-800' : ''
              }`}>
                {message.content}
              </p>
              
              {/* Timestamp */}
              <div className="flex items-center justify-between">
                <span className={`text-xs opacity-70 ${
                  isError ? 'text-red-600' : ''
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                
                {/* Sender badge */}
                <Badge 
                  variant={isUser ? 'secondary' : isError ? 'destructive' : 'outline'} 
                  className="text-xs"
                >
                  {isUser ? 'You' : isError ? 'Error' : 'AI'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback buttons for AI messages (not for errors) */}
        {!isUser && !isError && onFeedback && (
          <div className="flex items-center justify-start space-x-1 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFeedback(message.id, 'helpful')}
              className={`h-8 px-2 ${
                message.feedback === 'helpful' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-500 hover:text-green-600'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFeedback(message.id, 'unhelpful')}
              className={`h-8 px-2 ${
                message.feedback === 'unhelpful' 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message; 