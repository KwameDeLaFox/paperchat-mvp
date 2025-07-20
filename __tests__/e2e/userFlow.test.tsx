import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '../../pages/index'

// Mock the API responses
const mockSampleResponse = {
  text: 'PaperChat MVP - Sample Document\n\nIntroduction\nPaperChat is an AI-powered PDF chat application that allows users to upload PDF documents and ask questions about their content.',
  filename: 'PaperChat MVP - Sample Document',
  pages: 3
}

const mockUploadResponse = {
  text: 'This is an uploaded document about machine learning algorithms and their implementation.',
  filename: 'Uploaded Document',
  pages: 5
}

const mockChatResponse = {
  response: 'This document discusses machine learning algorithms and their practical applications in various fields.',
  messageId: 'msg_123456789'
}

describe('End-to-End User Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Demo Mode Flow', () => {
    it('should complete demo mode flow successfully', async () => {
      // Mock API responses
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSampleResponse
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockChatResponse
        })

      render(<Home />)

      // 1. Click demo mode button
      const demoButton = screen.getByText(/Try Demo Mode/i)
      fireEvent.click(demoButton)

      // 2. Wait for demo document to load
      await waitFor(() => {
        expect(screen.getByText(/Document loaded/i)).toBeInTheDocument()
      })

      // Switch to text view to see document content
      const switchToTextButton = screen.getByText(/Switch to Text View/i)
      fireEvent.click(switchToTextButton)

      await waitFor(() => {
        expect(screen.getByText(/PaperChat MVP - Sample Document/i)).toBeInTheDocument()
      })

      // 3. Wait for chat input and type a question
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument()
      })

      const chatInput = screen.getByPlaceholderText(/Type a message/i)
      fireEvent.change(chatInput, { target: { value: 'What is this document about?' } })

      // 4. Send the message
      const sendButton = screen.getByText(/Send/i)
      fireEvent.click(sendButton)

      // 5. Verify AI response
      await waitFor(() => {
        expect(screen.getByText(/This document discusses machine learning algorithms/i)).toBeInTheDocument()
      })

      // 6. Verify feedback buttons appear
      expect(screen.getByText(/👍/i)).toBeInTheDocument()
      expect(screen.getByText(/👎/i)).toBeInTheDocument()
    })

    it('should handle demo mode loading errors', async () => {
      // Mock API error
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Demo service temporarily unavailable' })
      })

      render(<Home />)

      const demoButton = screen.getByText(/Try Demo Mode/i)
      fireEvent.click(demoButton)

      await waitFor(() => {
        expect(screen.getByText(/Demo service temporarily unavailable/i)).toBeInTheDocument()
      })
    })
  })

  describe('File Upload Flow', () => {
    it('should complete file upload flow successfully', async () => {
      // Mock API responses
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUploadResponse
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockChatResponse
        })

      render(<Home />)

      // 1. Create and upload a file
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByTestId('file-input')
      fireEvent.change(fileInput, { target: { files: [file] } })

      // 2. Wait for upload to complete
      await waitFor(() => {
        expect(screen.getByText(/Uploaded Document/i)).toBeInTheDocument()
      })

      // 3. Wait for chat input and type a question
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument()
      })

      const chatInput = screen.getByPlaceholderText(/Type a message/i)
      fireEvent.change(chatInput, { target: { value: 'What are the main topics?' } })

      // 4. Send the message
      const sendButton = screen.getByText(/Send/i)
      fireEvent.click(sendButton)

      // 5. Verify AI response
      await waitFor(() => {
        expect(screen.getByText(/This document discusses machine learning algorithms/i)).toBeInTheDocument()
      })
    })

    it('should handle file upload errors gracefully', async () => {
      render(<Home />)

      // 1. Try to upload invalid file
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const fileInput = screen.getByTestId('file-input')
      fireEvent.change(fileInput, { target: { files: [file] } })

      // 2. Verify error message
      await waitFor(() => {
        expect(screen.getAllByText(/Please upload a PDF file/i)).toHaveLength(2)
      })

      // 3. Verify upload interface is still available
      expect(screen.getByText(/Choose PDF File/i)).toBeInTheDocument()
    })

    it('should handle oversized file upload', async () => {
      render(<Home />)

      // 1. Create oversized file
      const largeContent = 'x'.repeat(11 * 1024 * 1024)
      const file = new File([largeContent], 'large.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByTestId('file-input')
      fireEvent.change(fileInput, { target: { files: [file] } })

      // 2. Verify error message
      await waitFor(() => {
        expect(screen.getAllByText(/File too large/i)).toHaveLength(2)
      })
    })
  })

  describe('Chat Interface Flow', () => {

    it('should handle multiple chat messages', async () => {
      // Mock multiple chat responses
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSampleResponse
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ response: 'First response', messageId: 'msg_1' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ response: 'Second response', messageId: 'msg_2' })
        })

      render(<Home />)
      const demoButton = screen.getByText(/Try Demo Mode/i)
      fireEvent.click(demoButton)

      await waitFor(() => {
        expect(screen.getByText(/Document loaded/i)).toBeInTheDocument()
      })

      // Switch to text view to see document content
      const switchToTextButton = screen.getByText(/Switch to Text View/i)
      fireEvent.click(switchToTextButton)

      await waitFor(() => {
        expect(screen.getByText(/PaperChat MVP - Sample Document/i)).toBeInTheDocument()
      })

      // Wait for chat input to be available
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument()
      })

      const chatInput = screen.getByPlaceholderText(/Type a message/i)
      const sendButton = screen.getByText(/Send/i)

      // Send first message
      fireEvent.change(chatInput, { target: { value: 'First question?' } })
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/First response/i)).toBeInTheDocument()
      })

      // Send second message
      fireEvent.change(chatInput, { target: { value: 'Second question?' } })
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/Second response/i)).toBeInTheDocument()
      })

      // Verify both messages are displayed
      expect(screen.getByText(/First question?/i)).toBeInTheDocument()
      expect(screen.getByText(/Second question?/i)).toBeInTheDocument()
    })

    it('should handle chat API errors with retry', async () => {
      // Mock demo load, API error then success
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSampleResponse
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ error: 'AI service temporarily unavailable' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ response: 'Success response', messageId: 'msg_retry' })
        })

      render(<Home />)
      const demoButton = screen.getByText(/Try Demo Mode/i)
      fireEvent.click(demoButton)

      await waitFor(() => {
        expect(screen.getByText(/Document loaded/i)).toBeInTheDocument()
      })

      // Switch to text view to see document content
      const switchToTextButton = screen.getByText(/Switch to Text View/i)
      fireEvent.click(switchToTextButton)

      await waitFor(() => {
        expect(screen.getByText(/PaperChat MVP - Sample Document/i)).toBeInTheDocument()
      })

      // Wait for chat input to be available
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument()
      })

      const chatInput = screen.getByPlaceholderText(/Type a message/i)
      fireEvent.change(chatInput, { target: { value: 'Test question?' } })
      
      const sendButton = screen.getByText(/Send/i)
      fireEvent.click(sendButton)

      // Verify error message appears
      await waitFor(() => {
        expect(screen.getByText(/AI service temporarily unavailable/i)).toBeInTheDocument()
      })

      // Verify retry button appears
      const retryButton = screen.getByText(/Retry/i)
      expect(retryButton).toBeInTheDocument()

      // Click retry
      fireEvent.click(retryButton)

      // Verify success response
      await waitFor(() => {
        expect(screen.getByText(/Success response/i)).toBeInTheDocument()
      })
    })

    it('should handle empty message validation', async () => {
      // Mock demo load
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSampleResponse
        })

      render(<Home />)
      const demoButton = screen.getByText(/Try Demo Mode/i)
      fireEvent.click(demoButton)

      await waitFor(() => {
        expect(screen.getByText(/Document loaded/i)).toBeInTheDocument()
      })

      // Switch to text view to see document content
      const switchToTextButton = screen.getByText(/Switch to Text View/i)
      fireEvent.click(switchToTextButton)

      await waitFor(() => {
        expect(screen.getByText(/PaperChat MVP - Sample Document/i)).toBeInTheDocument()
      })

      // Wait for chat input to be available
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument()
      })

      const chatInput = screen.getByPlaceholderText(/Type a message/i)
      const sendButton = screen.getByText(/Send/i)

      // Try to send empty message
      fireEvent.change(chatInput, { target: { value: '' } })
      fireEvent.click(sendButton)

      // Verify no API call was made (no fetch calls for chat)
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should handle feedback submission', async () => {
      // Mock demo load, chat response and feedback submission
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSampleResponse
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ response: 'Test response', messageId: 'msg_feedback' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        })

      render(<Home />)
      const demoButton = screen.getByText(/Try Demo Mode/i)
      fireEvent.click(demoButton)

      await waitFor(() => {
        expect(screen.getByText(/Document loaded/i)).toBeInTheDocument()
      })

      // Switch to text view to see document content
      const switchToTextButton = screen.getByText(/Switch to Text View/i)
      fireEvent.click(switchToTextButton)

      await waitFor(() => {
        expect(screen.getByText(/PaperChat MVP - Sample Document/i)).toBeInTheDocument()
      })

      // Wait for chat input to be available
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument()
      })

      const chatInput = screen.getByPlaceholderText(/Type a message/i)
      fireEvent.change(chatInput, { target: { value: 'Test question?' } })
      
      const sendButton = screen.getByText(/Send/i)
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/Test response/i)).toBeInTheDocument()
      })

      // Submit helpful feedback
      const helpfulButton = screen.getByText(/👍/i)
      fireEvent.click(helpfulButton)

      // Verify feedback was submitted (no errors)
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2) // chat + feedback
      })
    })
  })

  describe('Error Recovery Flow', () => {
    it('should recover from network errors', async () => {
      // Mock network error then success
      global.fetch = jest.fn()
        .mockRejectedValueOnce(new TypeError('fetch failed'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSampleResponse
        })

      render(<Home />)

      const demoButton = screen.getByText(/Try Demo Mode/i)
      fireEvent.click(demoButton)

      // Verify network error appears
      await waitFor(() => {
        expect(screen.getByText(/fetch failed/i)).toBeInTheDocument()
      })

      // Verify retry button appears
      const retryButton = screen.getByText(/Retry/i)
      expect(retryButton).toBeInTheDocument()

      // Click retry
      fireEvent.click(retryButton)

      // Verify successful recovery
      await waitFor(() => {
        expect(screen.getByText(/Document loaded/i)).toBeInTheDocument()
      })

      // Switch to text view to see document content
      const switchToTextButton = screen.getByText(/Switch to Text View/i)
      fireEvent.click(switchToTextButton)

      await waitFor(() => {
        expect(screen.getByText(/PaperChat MVP - Sample Document/i)).toBeInTheDocument()
      })
    })

    it('should handle maximum retry attempts', async () => {
      // Mock persistent errors
      global.fetch = jest.fn().mockRejectedValue(new TypeError('fetch failed'))

      render(<Home />)

      const demoButton = screen.getByText(/Try Demo Mode/i)
      fireEvent.click(demoButton)

      // Retry multiple times
      for (let i = 0; i < 3; i++) {
        await waitFor(() => {
          expect(screen.getByText(/Retry/i)).toBeInTheDocument()
        })
        
        const retryButton = screen.getByText(/Retry/i)
        fireEvent.click(retryButton)
      }

      // Verify max retries reached
      await waitFor(() => {
        expect(screen.getByText(/fetch failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('Mobile Responsiveness', () => {
    it('should handle mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<Home />)

      // Verify mobile-friendly elements are present
      expect(screen.getByText(/Choose PDF File/i)).toBeInTheDocument()
      expect(screen.getByText(/Try Demo Mode/i)).toBeInTheDocument()
    })
  })
}) 