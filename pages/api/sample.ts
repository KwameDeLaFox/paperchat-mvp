import type { NextApiRequest, NextApiResponse } from 'next';

// Sample PDF content for demo mode
const sampleDocumentText = `
PaperChat MVP - Sample Document

Introduction
PaperChat is an AI-powered PDF chat application that allows users to upload PDF documents and ask questions about their content. The application uses OpenAI's GPT model to provide intelligent responses based on the document content.

Key Features
1. PDF Upload: Users can upload PDF files up to 10MB in size
2. Text Extraction: The app extracts text content from uploaded PDFs
3. AI Chat: Users can ask questions about the document content
4. Demo Mode: A sample document is available for testing
5. Feedback System: Users can provide feedback on AI responses

Technical Stack
- Frontend: Next.js with React and TypeScript
- Styling: Tailwind CSS with shadcn/ui components
- Backend: Next.js API routes
- PDF Processing: pdf-parse library
- AI Integration: OpenAI GPT-3.5-turbo
- Storage: In-memory (no database for MVP)

Architecture
The application follows a simple architecture:
- File upload and text extraction via API routes
- In-memory storage of document content
- OpenAI API integration for chat responses
- Real-time feedback collection

User Flow
1. User uploads a PDF document
2. System extracts text content
3. User asks questions about the document
4. AI responds based on document content
5. User provides feedback on responses

Development Guidelines
- Keep it simple and focused on MVP features
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Ensure responsive design
- Maintain accessibility standards

This sample document demonstrates the capabilities of PaperChat and provides context for testing the chat functionality.
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.status(200).json({
      text: sampleDocumentText,
      pages: 1,
      filename: 'sample-document.pdf',
      isDemo: true
    });
  } catch (error: any) {
    console.error('Sample API error:', error);
    res.status(500).json({ error: 'Failed to load sample document' });
  }
} 