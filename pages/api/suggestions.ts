import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentText, documentType } = req.body;

    // Validate required fields
    if (!documentText || typeof documentText !== 'string') {
      return res.status(400).json({ 
        error: 'Document text is required and must be a string' 
      });
    }

    if (documentText.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Document text cannot be empty' 
      });
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured' 
      });
    }

    // Create context-aware prompt based on document type
    const getPrompt = (text: string, type: string) => {
      const basePrompt = `Based on the following document content, generate 4-6 specific, relevant questions that a user might want to ask about this document. The questions should be:
1. Directly related to the document's content
2. Specific and actionable
3. Cover different aspects (summary, details, implications, etc.)
4. Written in natural, conversational language
5. Focused on what the document actually discusses

Document type: ${type}
Document content (first 2000 characters): ${text.substring(0, 2000)}

Generate only the questions, one per line, without numbering or additional text.`;

      switch (type) {
        case 'research':
          return `${basePrompt}

Focus on research-specific questions like:
- What are the main findings/conclusions?
- What methodology was used?
- What are the limitations?
- What are the implications for future research?
- Who conducted the study and when?`;

        case 'manual':
          return `${basePrompt}

Focus on practical questions like:
- How do I get started?
- What are the requirements/prerequisites?
- What are the best practices?
- How do I troubleshoot common issues?
- What are the key steps or procedures?`;

        case 'report':
          return `${basePrompt}

Focus on report-specific questions like:
- What are the key metrics/results?
- What are the main recommendations?
- What are the conclusions?
- What is the timeline or scope?
- What are the implications for stakeholders?`;

        case 'article':
          return `${basePrompt}

Focus on article-specific questions like:
- What is the main argument or thesis?
- What evidence is provided?
- Who is the author and what are their credentials?
- What are the implications or conclusions?
- How does this relate to other research?`;

        default:
          return basePrompt;
      }
    };

    const prompt = getPrompt(documentText, documentType || 'general');

    // Add timeout to the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates relevant questions based on document content. Provide only the questions, one per line, without numbering or additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const aiResponse = response.choices[0]?.message?.content;
      
      if (!aiResponse) {
        return res.status(500).json({ 
          error: 'AI service returned an empty response' 
        });
      }

      // Parse the response into individual suggestions
      const suggestions = aiResponse
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .filter(line => !line.match(/^\d+\./)) // Remove numbered lines
        .slice(0, 6); // Limit to 6 suggestions

      if (suggestions.length === 0) {
        return res.status(500).json({ 
          error: 'No valid suggestions generated' 
        });
      }

      res.status(200).json({ 
        suggestions,
        documentType: documentType || 'general'
      });

    } catch (openaiError: any) {
      clearTimeout(timeoutId);
      throw openaiError;
    }

  } catch (error: any) {
    console.error('Suggestions error:', error);
    
    // Handle timeout
    if (error.name === 'AbortError') {
      return res.status(408).json({ 
        error: 'Request timed out. Please try again.' 
      });
    }
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota' || error.status === 429) {
      return res.status(429).json({ 
        error: 'AI service is busy. Please try again later.' 
      });
    }
    
    if (error.code === 'invalid_api_key' || error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your OpenAI configuration.' 
      });
    }
    
    if (error.code === 'rate_limit_exceeded' || error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait a moment before trying again.' 
      });
    }
    
    // Generic error
    res.status(500).json({ 
      error: 'Failed to generate suggestions. Please try again later.' 
    });
  }
} 