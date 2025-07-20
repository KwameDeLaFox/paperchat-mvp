import React, { useEffect, useRef, useMemo } from 'react';
import Message from './Message';
import { MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  feedback?: 'helpful' | 'unhelpful';
  isError?: boolean;
}

interface MessageListProps {
  messages: ChatMessage[];
  onFeedback?: (messageId: string, feedback: 'helpful' | 'unhelpful') => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onFeedback }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Memoize the messages to prevent unnecessary re-renders
  const memoizedMessages = useMemo(() => messages, [messages]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [memoizedMessages]);

  return (
    <div className="flex-1 overflow-y-auto bg-muted/30 flex flex-col">
      {memoizedMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="mb-6 max-w-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Start a conversation
            </h3>
            <p className="text-sm text-muted-foreground">
              Ask questions about your document and get AI-powered responses based on the content.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-4 space-y-0">
          {memoizedMessages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onFeedback={onFeedback}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList; 