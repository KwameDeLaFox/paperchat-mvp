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
      return res.status(400).json({ 
        error: 'No file provided. Please select a PDF file to upload.' 
      });
    }

    // Validate file type again (in case formidable filter didn't work)
    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ 
        error: 'Invalid file type. Only PDF files are supported.' 
      });
    }

    // Validate file size again
    if (file.size > 10 * 1024 * 1024) {
      return res.status(413).json({ 
        error: `File too large. Maximum size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.` 
      });
    }

    // Extract text from PDF
    const dataBuffer = await fs.promises.readFile(file.filepath);
    
    let data;
    try {
      data = await pdf(dataBuffer);
    } catch (pdfError: any) {
      console.error('PDF parsing error:', pdfError);
      
      // Handle specific PDF parsing errors
      if (pdfError.message?.includes('password')) {
        return res.status(400).json({ 
          error: 'This PDF is password-protected. Please remove the password and try again.' 
        });
      }
      
      if (pdfError.message?.includes('corrupt') || pdfError.message?.includes('invalid')) {
        return res.status(400).json({ 
          error: 'Unable to read this PDF. The file might be corrupted. Try a different file.' 
        });
      }
      
      return res.status(400).json({ 
        error: 'Unable to process this PDF. The file might be empty or contain only images.' 
      });
    }
    
    // Clean up temporary file
    try {
      await fs.promises.unlink(file.filepath);
    } catch (unlinkError) {
      console.error('Failed to clean up temporary file:', unlinkError);
      // Don't fail the request for cleanup errors
    }
    
    // Validate extracted text
    if (!data.text || data.text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Unable to extract text from this PDF. The file might be empty or contain only images.' 
      });
    }

    // Check if document is too long for processing
    const textLength = data.text.length;
    if (textLength > 1000000) { // 1MB of text
      return res.status(400).json({ 
        error: 'This document is quite long. For best results, try asking specific questions about smaller sections.' 
      });
    }
    
    res.status(200).json({ 
      text: data.text,
      pages: data.numpages || 1,
      filename: file.originalFilename || 'document.pdf'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    // Handle formidable-specific errors
    if (error.message?.includes('maxFileSize')) {
      return res.status(413).json({ 
        error: 'File too large. Maximum size is 10MB.' 
      });
    }
    
    if (error.message?.includes('filter') || error.message?.includes('mimetype')) {
      return res.status(400).json({ 
        error: 'Invalid file type. Only PDF files are supported.' 
      });
    }
    
    // Handle file system errors
    if (error.code === 'ENOENT') {
      return res.status(400).json({ 
        error: 'File not found. Please try uploading again.' 
      });
    }
    
    if (error.code === 'EACCES') {
      return res.status(500).json({ 
        error: 'Permission denied. Please try again later.' 
      });
    }
    
    // Handle network/timeout errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return res.status(408).json({ 
        error: 'Upload timed out. Please try again with a smaller file.' 
      });
    }
    
    // Generic error
    res.status(500).json({ 
      error: 'Unable to process this PDF. Please try a different file or contact support if the problem persists.' 
    });
  }
} 