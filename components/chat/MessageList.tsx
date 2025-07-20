import React, { useEffect, useRef } from 'react';
import Message from './Message';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  feedback?: 'helpful' | 'unhelpful';
}

interface MessageListProps {
  messages: ChatMessage[];
  onFeedback?: (messageId: string, feedback: 'helpful' | 'unhelpful') => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onFeedback }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Start a conversation
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Ask questions about your document and get AI-powered responses based on the content.
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onFeedback={onFeedback}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList; 