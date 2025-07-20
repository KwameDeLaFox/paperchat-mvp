import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import pdf from 'pdf-parse';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ mimetype }) => mimetype === 'application/pdf',
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    // Extract text from PDF
    const dataBuffer = await fs.promises.readFile(file.filepath);
    const data = await pdf(dataBuffer);
    
    // Clean up temporary file
    await fs.promises.unlink(file.filepath);
    
    res.status(200).json({ 
      text: data.text,
      pages: data.numpages,
      filename: file.originalFilename || 'document.pdf'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    // Handle specific error cases
    if (error.message?.includes('maxFileSize')) {
      return res.status(400).json({ error: 'File too large (max 10MB)' });
    }
    
    if (error.message?.includes('filter')) {
      return res.status(400).json({ error: 'Please upload a PDF file' });
    }
    
    res.status(500).json({ error: 'Failed to process PDF' });
  }
} 