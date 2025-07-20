import React, { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  feedback?: 'helpful' | 'unhelpful';
  isError?: boolean;
}

interface ChatInterfaceProps {
  documentText: string;
}

interface ChatError {
  type: 'network' | 'api' | 'rate-limit' | 'timeout' | 'unknown';
  message: string;
  retryable: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ documentText }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;

  const clearError = () => {
    setError(null);
    setRetryCount(0);
  };

  const handleError = (errorType: ChatError['type'], message: string, retryable: boolean = true) => {
    const chatError: ChatError = {
      type: errorType,
      message,
      retryable
    };
    setError(chatError);
  };

  // Detect document type based on content
  const detectDocumentType = (): 'research' | 'manual' | 'report' | 'article' | 'general' => {
    const text = documentText.toLowerCase();
    
    if (text.includes('research') || text.includes('study') || text.includes('methodology') || text.includes('findings')) {
      return 'research';
    }
    if (text.includes('manual') || text.includes('guide') || text.includes('instructions') || text.includes('how to')) {
      return 'manual';
    }
    if (text.includes('report') || text.includes('analysis') || text.includes('metrics') || text.includes('recommendations')) {
      return 'report';
    }
    if (text.includes('article') || text.includes('author') || text.includes('argument') || text.includes('evidence')) {
      return 'article';
    }
    
    return 'general';
  };

  const sendMessage = async (content: string, isRetry: boolean = false) => {
    if (isRetry && retryCount >= MAX_RETRIES) {
      handleError('unknown', 'Maximum retry attempts reached. Please try asking a different question.', false);
      return;
    }

    // Add user message immediately (unless it's a retry)
    if (!isRetry) {
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
    }

    setIsLoading(true);
    clearError();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          documentText,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorType: ChatError['type'] = 'unknown';
        let errorMessage = 'Failed to get response from AI';
        let retryable = true;

        if (response.status === 429) {
          errorType = 'rate-limit';
          errorMessage = 'AI service is busy. Please wait a moment and try again.';
          retryable = true;
        } else if (response.status === 408 || response.status === 504) {
          errorType = 'timeout';
          errorMessage = 'Request timed out. This document might be too long. Try asking a more specific question.';
          retryable = true;
        } else if (response.status >= 500) {
          errorType = 'api';
          errorMessage = 'AI service temporarily unavailable. Please try again later.';
          retryable = true;
        } else if (response.status === 400) {
          errorType = 'api';
          errorMessage = result.error || 'Invalid request. Please try rephrasing your question.';
          retryable = false;
        } else {
          errorType = 'api';
          errorMessage = result.error || 'Failed to get response from AI';
          retryable = true;
        }

        handleError(errorType, errorMessage, retryable);
        
        // Add error message to chat
        const errorMessageObj: ChatMessage = {
          id: `error_${Date.now()}`,
          content: errorMessage,
          sender: 'ai',
          timestamp: new Date(),
          isError: true,
        };
        
        setMessages(prev => [...prev, errorMessageObj]);
        return;
      }

      // Add AI response
      const aiMessage: ChatMessage = {
        id: result.messageId || `ai_${Date.now()}`,
        content: result.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      
      let errorType: ChatError['type'] = 'unknown';
      let errorMessage = 'Failed to get response from AI';
      let retryable = true;

      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorType = 'network';
        errorMessage = 'Network error. Please check your internet connection and try again.';
        retryable = true;
      } else if (err instanceof Error) {
        errorMessage = err.message;
        retryable = true;
      }

      handleError(errorType, errorMessage, retryable);
      
      // Add error message to chat
      const errorMessageObj: ChatMessage = {
        id: `error_${Date.now()}`,
        content: errorMessage,
        sender: 'ai',
        timestamp: new Date(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (retryCount >= MAX_RETRIES) {
      handleError('unknown', 'Maximum retry attempts reached. Please try asking a different question.', false);
      return;
    }
    
    setRetryCount(prev => prev + 1);
    
    // Get the last user message to retry
    const lastUserMessage = messages
      .filter(msg => msg.sender === 'user')
      .pop();
    
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content, true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleFeedback = async (messageId: string, feedback: 'helpful' | 'unhelpful') => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          feedback,
        }),
      });

      if (response.ok) {
        // Update the message with feedback
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, feedback } 
              : msg
          )
        );
      } else {
        console.error('Failed to submit feedback:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Error Alert */}
      {error && (
        <Alert className="m-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>{error.message}</span>
              {error.retryable && retryCount < MAX_RETRIES && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="ml-2 h-8 px-3 text-xs border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
            </div>
            {retryCount > 0 && retryCount < MAX_RETRIES && (
              <div className="text-xs text-red-600 mt-1">
                Retry attempt {retryCount} of {MAX_RETRIES}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Messages */}
      <MessageList 
        messages={messages} 
        onFeedback={handleFeedback}
      />

      {/* Suggestions (only show when no messages) */}
      {messages.length === 0 && !isLoading && (
        <ChatSuggestions 
          onSuggestionClick={handleSuggestionClick}
          documentText={documentText}
          documentType={detectDocumentType()}
        />
      )}

      {/* Input */}
      <ChatInput 
        onSend={sendMessage}
        isLoading={isLoading}
        disabled={!documentText}
      />
    </div>
  );
};

export default ChatInterface; 