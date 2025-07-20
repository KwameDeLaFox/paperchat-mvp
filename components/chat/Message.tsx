import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  feedback?: 'helpful' | 'unhelpful';
}

interface MessageProps {
  message: Message;
  onFeedback?: (messageId: string, feedback: 'helpful' | 'unhelpful') => void;
}

const Message: React.FC<MessageProps> = ({ message, onFeedback }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <Card className={`${isUser ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border shadow-sm'}`}>
          <CardContent className="p-3">
            <div className="space-y-2">
              {/* Message content */}
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
              
              {/* Timestamp */}
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                
                {/* Sender badge */}
                <Badge variant={isUser ? 'secondary' : 'outline'} className="text-xs">
                  {isUser ? 'You' : 'AI'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback buttons for AI messages */}
        {!isUser && onFeedback && (
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