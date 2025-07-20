# PaperChat MVP

A minimal viable product that allows users to upload PDF documents and chat with them using AI. Built with Next.js, TypeScript, and OpenAI.

## 🚀 Features

- **PDF Upload**: Drag & drop or click to upload PDF files (max 10MB)
- **Text Extraction**: Automatically extracts text content from PDFs
- **AI Chat**: Ask questions about your document and get AI-powered responses
- **Demo Mode**: Try the app immediately with a sample document
- **Error Handling**: Comprehensive error handling with retry functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Feedback System**: Rate AI responses to help improve the service

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **PDF Processing**: pdf-parse, react-pdf
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Testing**: Jest, React Testing Library
- **Error Handling**: Custom error handling utilities with retry logic

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd paperchat
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

You can get an OpenAI API key from [OpenAI's platform](https://platform.openai.com/api-keys).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
paperchat/
├── components/           # React components
│   ├── chat/            # Chat interface components
│   ├── upload/          # File upload components
│   ├── pdf/             # PDF viewer components
│   ├── ui/              # shadcn/ui components
│   └── layout/          # Layout components
├── lib/                 # Utility libraries
│   ├── errorHandling.ts # Error handling utilities
│   └── utils.ts         # General utilities
├── pages/               # Next.js pages and API routes
│   ├── api/             # API endpoints
│   └── index.tsx        # Main page
├── styles/              # Global styles
├── __tests__/           # Test files
└── public/              # Static assets
```

## 🔧 API Endpoints

### POST `/api/upload`
Upload and process a PDF file.

**Request:**
- `file`: PDF file (multipart/form-data)

**Response:**
```json
{
  "text": "Extracted text content",
  "pages": 5,
  "filename": "document.pdf"
}
```

### POST `/api/chat`
Send a message and get AI response.

**Request:**
```json
{
  "message": "What is this document about?",
  "documentText": "Document content..."
}
```

**Response:**
```json
{
  "response": "AI response text",
  "messageId": "unique_message_id"
}
```

### GET `/api/sample`
Get sample document for demo mode.

**Response:**
```json
{
  "text": "Sample document content",
  "filename": "Sample Document",
  "pages": 1
}
```

### POST `/api/feedback`
Submit feedback on AI responses.

**Request:**
```json
{
  "messageId": "message_id",
  "feedback": "helpful" | "unhelpful"
}
```

## 🧪 Testing

### Run tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Test individual functions and utilities
- **Component Tests**: Test React components in isolation
- **Integration Tests**: Test complete user flows
- **Error Handling Tests**: Test error scenarios and edge cases

## 🚨 Error Handling

The application includes comprehensive error handling:

### Error Types
- **Upload Errors**: File validation, size limits, processing failures
- **Chat Errors**: API failures, network issues, rate limiting
- **Network Errors**: Connection issues, timeouts
- **Validation Errors**: Invalid input, missing data

### Error Features
- **User-friendly messages**: Clear, actionable error messages
- **Retry functionality**: Automatic retry for transient errors
- **Exponential backoff**: Intelligent retry delays
- **Error boundaries**: Graceful error recovery
- **Error tracking**: Comprehensive error logging

### Error Messages
- "File too large (max 10MB)"
- "Please upload a PDF file"
- "Unable to read this PDF. Try a different file."
- "AI service temporarily unavailable"
- "This document is quite long. For best results, try asking specific questions."

## 🎨 UI/UX Features

### Design System
- **shadcn/ui**: Modern, accessible component library
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: CSS variables for theming

### User Experience
- **Split Layout**: PDF viewer and chat side by side
- **Drag & Drop**: Intuitive file upload
- **Loading States**: Clear feedback during operations
- **Error Recovery**: Easy retry and recovery options
- **Demo Mode**: Zero-friction onboarding

## 🔒 Security

### File Upload Security
- **File Type Validation**: Only PDF files accepted
- **Size Limits**: Maximum 10MB file size
- **Content Validation**: Extracted text validation
- **Temporary Storage**: Files processed and discarded

### API Security
- **Input Validation**: All inputs validated and sanitized
- **Rate Limiting**: Basic rate limiting on API endpoints
- **Error Sanitization**: No sensitive data in error messages
- **CORS**: Proper CORS configuration

## 🚀 Deployment

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

### Build for Production
```bash
npm run build
npm start
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js apps
- **Netlify**: Alternative deployment option
- **AWS/GCP**: For custom infrastructure

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Testing**: Minimum 70% code coverage

## 📊 Performance

### Optimization Features
- **Code Splitting**: Automatic Next.js code splitting
- **Image Optimization**: Next.js image optimization
- **Bundle Analysis**: Webpack bundle analyzer
- **Lazy Loading**: Components loaded on demand

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🐛 Troubleshooting

### Common Issues

**PDF Upload Fails**
- Check file size (max 10MB)
- Ensure file is a valid PDF
- Try a different PDF file

**AI Responses Fail**
- Check OpenAI API key configuration
- Verify internet connection
- Check OpenAI service status

**Build Errors**
- Clear `.next` directory
- Reinstall dependencies
- Check Node.js version

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
```

## 📈 Monitoring

### Error Tracking
- Console error logging
- API error responses
- User feedback tracking

### Performance Monitoring
- Core Web Vitals tracking
- API response times
- User interaction metrics

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [OpenAI](https://openai.com/) - AI API
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF processing

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Note**: This is an MVP (Minimum Viable Product) designed to validate the core concept. For production use, consider adding features like user authentication, document storage, and advanced analytics.
