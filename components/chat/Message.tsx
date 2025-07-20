import React from 'react';
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, AlertCircle, User, Bot } from 'lucide-react';

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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 min-w-0`}>
      <div className={`max-w-[75%] min-w-0 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Message Bubble */}
        <div className={`relative px-4 py-3 rounded-[18px] max-w-full min-w-0 ${
          isUser 
            ? 'bg-[#4f9cff] text-white rounded-br-[4px]' 
            : isError
              ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-[4px]'
              : 'bg-[#e0e0e0] text-black rounded-bl-[4px]'
        }`}>
          <p className="text-sm leading-relaxed break-words overflow-hidden">
            {message.content}
          </p>
          
          {/* Timestamp */}
          <div className={`text-[0.65rem] opacity-60 absolute bottom-[-16px] ${
            isUser ? 'right-2' : 'left-2'
          }`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>

        {/* Feedback buttons for AI messages (not for errors) */}
        {!isUser && !isError && onFeedback && (
          <div className="flex items-center gap-1 mt-2 ml-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFeedback(message.id, 'helpful')}
              className={`h-6 w-6 p-0 ${
                message.feedback === 'helpful' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFeedback(message.id, 'unhelpful')}
              className={`h-6 w-6 p-0 ${
                message.feedback === 'unhelpful' 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
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