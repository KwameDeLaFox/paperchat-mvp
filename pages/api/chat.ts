import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Utility function to chunk text
function chunkText(text: string, maxLength: number): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  const sentences = text.split('. ');
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        // Single sentence is too long, split by words
        const words = sentence.split(' ');
        for (const word of words) {
          if ((currentChunk + word).length > maxLength) {
            chunks.push(currentChunk.trim());
            currentChunk = word;
          } else {
            currentChunk += (currentChunk ? ' ' : '') + word;
          }
        }
      }
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, documentText } = req.body;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
    }

    if (!documentText || typeof documentText !== 'string') {
      return res.status(400).json({ 
        error: 'Document text is required and must be a string' 
      });
    }

    // Validate message length
    if (message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message cannot be empty' 
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({ 
        error: 'Message too long. Please keep your question under 1000 characters.' 
      });
    }

    // Validate document text length
    if (documentText.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Document text is empty. Please upload a valid PDF document.' 
      });
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.' 
      });
    }

    if (process.env.OPENAI_API_KEY === 'your_openai_api_key_here' || process.env.OPENAI_API_KEY.length < 10) {
      return res.status(500).json({ 
        error: 'Invalid OpenAI API key. Please check your configuration.' 
      });
    }

    // Chunk text if too long (OpenAI context window is ~4000 tokens)
    const chunks = chunkText(documentText, 3000);
    const contextText = chunks[0]; // Use first chunk for now
    
    // Add timeout to the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that answers questions based on the provided document content. Only answer questions based on the information in the document. If the document doesn't contain relevant information, say so clearly. Here is the document content: ${contextText}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const aiResponse = response.choices[0]?.message?.content;
      
      if (!aiResponse) {
        return res.status(500).json({ 
          error: 'AI service returned an empty response. Please try again.' 
        });
      }

      res.status(200).json({ 
        response: aiResponse,
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    } catch (openaiError: any) {
      clearTimeout(timeoutId);
      throw openaiError;
    }

  } catch (error: any) {
    console.error('Chat error:', error);
    
    // Handle timeout
    if (error.name === 'AbortError') {
      return res.status(408).json({ 
        error: 'Request timed out. This document might be too long. Try asking a more specific question.' 
      });
    }
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota' || error.status === 429) {
      return res.status(429).json({ 
        error: 'AI service is busy. Please wait a moment and try again.' 
      });
    }
    
    if (error.code === 'invalid_api_key' || error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your OpenAI configuration.' 
      });
    }
    
    if (error.code === 'context_length_exceeded' || error.message?.includes('context_length')) {
      return res.status(400).json({ 
        error: 'This document is quite long. For best results, try asking specific questions about smaller sections.' 
      });
    }
    
    if (error.code === 'rate_limit_exceeded' || error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait a moment before trying again.' 
      });
    }
    
    if (error.code === 'model_not_found' || error.status === 404) {
      return res.status(500).json({ 
        error: 'AI model not available. Please try again later.' 
      });
    }
    
    if (error.code === 'invalid_request_error' || error.status === 400) {
      return res.status(400).json({ 
        error: 'Invalid request. Please try rephrasing your question.' 
      });
    }
    
    // Handle network errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        error: 'Network error. Please check your internet connection and try again.' 
      });
    }
    
    // Generic error
    res.status(500).json({ 
      error: 'AI service temporarily unavailable. Please try again later.' 
    });
  }
} 