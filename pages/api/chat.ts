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

    if (!message || !documentText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env.local file with a valid API key from https://platform.openai.com/account/api-keys' 
      });
    }

    // Chunk text if too long (OpenAI context window is ~4000 tokens)
    const chunks = chunkText(documentText, 3000);
    const contextText = chunks[0]; // Use first chunk for now
    
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
    });

    const aiResponse = response.choices[0]?.message?.content;
    
    if (!aiResponse) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    res.status(200).json({ 
      response: aiResponse,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ error: 'API quota exceeded' });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    if (error.code === 'context_length_exceeded') {
      return res.status(400).json({ error: 'Document too long. Please try a shorter document or ask more specific questions.' });
    }
    
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
} 