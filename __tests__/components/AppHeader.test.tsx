import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppHeader from '@/components/layout/AppHeader';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/app',
  }),
}));

describe('AppHeader', () => {
  const mockDocumentInfo = {
    filename: 'test-document.pdf',
    pages: 5,
    isDemo: false,
  };

  const mockOnBackToUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and navigation links', () => {
    render(<AppHeader />);
    
    expect(screen.getByText('PaperChat')).toBeInTheDocument();
    expect(screen.getByText('How it Works')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('shows document info when provided', () => {
    render(<AppHeader documentInfo={mockDocumentInfo} />);
    
    // Check that document info appears (there are multiple instances - desktop and mobile)
    expect(screen.getAllByText('test-document.pdf')).toHaveLength(2);
    expect(screen.getByText('5 pages')).toBeInTheDocument();
  });

  it('shows demo badge for demo documents', () => {
    const demoDocumentInfo = { ...mockDocumentInfo, isDemo: true };
    render(<AppHeader documentInfo={demoDocumentInfo} />);
    
    // Check that demo badge appears (there are multiple instances - desktop and mobile)
    expect(screen.getAllByText('Demo')).toHaveLength(2);
  });

  it('calls onBackToUpload when New Upload button is clicked', () => {
    render(<AppHeader onBackToUpload={mockOnBackToUpload} />);
    
    const newUploadButton = screen.getByText('New Upload');
    fireEvent.click(newUploadButton);
    
    expect(mockOnBackToUpload).toHaveBeenCalledTimes(1);
  });

  it('shows mobile menu when hamburger button is clicked', () => {
    render(<AppHeader />);
    
    // Find the menu button by its aria-label
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    
    // Mobile menu should be visible - there are multiple "New Upload" buttons (desktop + mobile)
    expect(screen.getAllByText('New Upload')).toHaveLength(2);
  });

  it('renders navigation links in mobile menu', () => {
    render(<AppHeader />);
    
    // Find the menu button by its aria-label
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    
    // There are multiple instances of navigation links (desktop + mobile)
    expect(screen.getAllByText('How it Works')).toHaveLength(2);
    expect(screen.getAllByText('Pricing')).toHaveLength(2);
    expect(screen.getAllByText('Docs')).toHaveLength(2);
    expect(screen.getAllByText('About')).toHaveLength(2);
  });
}); 