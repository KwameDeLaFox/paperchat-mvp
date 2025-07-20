import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  pdfContext: string;
}

export interface ChatResponse {
  response: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function chatWithPDF(request: ChatRequest): Promise<ChatResponse> {
  try {
    // Create the system prompt with PDF context
    const systemPrompt = `You are a helpful AI assistant that answers questions about a PDF document. 
    
Here is the content of the PDF document:
${request.pdfContext}

Please answer the user's question based ONLY on the information provided in the PDF document above. 
If the question cannot be answered using the information in the PDF, please say so clearly.
Keep your answers concise and relevant to the document content.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: request.message,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return {
      response,
      usage: completion.usage ? {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        total_tokens: completion.usage.total_tokens,
      } : undefined,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('AI service configuration error');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('AI service temporarily unavailable due to high demand');
      }
      if (error.message.includes('quota')) {
        throw new Error('AI service quota exceeded');
      }
    }
    
    throw new Error('AI service temporarily unavailable');
  }
}

export default openai; 