import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FileUpload from '../../components/upload/FileUpload'

// Mock the onFileUpload and onError callbacks
const mockOnFileUpload = jest.fn()
const mockOnError = jest.fn()

describe('FileUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload interface correctly', () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} onError={mockOnError} />)
    
    expect(screen.getByText(/Choose PDF file/i)).toBeInTheDocument()
    expect(screen.getByText(/Drag & drop or click to select/i)).toBeInTheDocument()
    expect(screen.getByText(/Max file size: 10MB/i)).toBeInTheDocument()
  })

  it('handles valid PDF file upload', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} onError={mockOnError} />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    // Mock successful API response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Extracted text content', pages: 1, filename: 'test.pdf' })
    })

    const input = screen.getByLabelText(/Choose PDF file/i)
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith('Extracted text content')
    })
  })

  it('shows error for non-PDF file', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} onError={mockOnError} />)
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    
    const input = screen.getByLabelText(/Choose PDF file/i)
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/Please upload a PDF file/i)).toBeInTheDocument()
      expect(mockOnError).toHaveBeenCalledWith('Please upload a PDF file. Only PDF files are supported.')
    })
  })

  it('shows error for oversized file', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} onError={mockOnError} />)
    
    // Create a file larger than 10MB
    const largeContent = 'x'.repeat(11 * 1024 * 1024)
    const file = new File([largeContent], 'large.pdf', { type: 'application/pdf' })
    
    const input = screen.getByLabelText(/Choose PDF file/i)
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/File too large/i)).toBeInTheDocument()
      expect(mockOnError).toHaveBeenCalledWith('File too large. Maximum size is 10MB. Your file is 11.0MB.')
    })
  })

  it('handles API error responses', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} onError={mockOnError} />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    // Mock API error response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 413,
      json: async () => ({ error: 'File too large' })
    })

    const input = screen.getByLabelText(/Choose PDF file/i)
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/File too large/i)).toBeInTheDocument()
    })
  })

  it('handles network errors', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} onError={mockOnError} />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    // Mock network error
    global.fetch = jest.fn().mockRejectedValueOnce(new TypeError('fetch failed'))

    const input = screen.getByLabelText(/Choose PDF file/i)
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    })
  })

  it('shows retry button for retryable errors', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} onError={mockOnError} />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    // Mock server error (retryable)
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' })
    })

    const input = screen.getByLabelText(/Choose PDF file/i)
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/Retry/i)).toBeInTheDocument()
    })
  })

  it('handles drag and drop', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} onError={mockOnError} />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    // Mock successful API response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Extracted text content', pages: 1, filename: 'test.pdf' })
    })

    const dropZone = screen.getByText(/Drag & drop or click to select/i).closest('div')
    
    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file]
      }
    })

    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith('Extracted text content')
    })
  })

  it('shows loading state during upload', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} onError={mockOnError} />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    // Mock delayed API response
    global.fetch = jest.fn().mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ text: 'Extracted text content', pages: 1, filename: 'test.pdf' })
        }), 100)
      )
    )

    const input = screen.getByLabelText(/Choose PDF file/i)
    fireEvent.change(input, { target: { files: [file] } })

    // Should show loading state
    expect(screen.getByText(/Processing/i)).toBeInTheDocument()
  })
}) 