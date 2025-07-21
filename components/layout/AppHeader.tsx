import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, Upload, Home, FileText, MessageSquare, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AppHeaderProps {
  documentInfo?: {
    filename: string;
    pages?: number;
    isDemo?: boolean;
  };
  onBackToUpload?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ documentInfo, onBackToUpload }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'How it Works', href: '/how-it-works', icon: FileText },
    { name: 'Pricing', href: '/pricing', icon: FileText },
    { name: 'Docs', href: '/docs', icon: FileText },
    { name: 'About', href: '/about', icon: FileText },
  ];

  const handleBackToUpload = () => {
    if (onBackToUpload) {
      onBackToUpload();
    } else {
      // Fallback to page refresh to reset state
      window.location.href = '/app';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        {/* Left side - Logo and Back button */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">PaperChat</span>
          </Link>
          
          {documentInfo && (
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>/</span>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span className="max-w-[200px] truncate font-medium text-foreground">{documentInfo.filename}</span>
                {documentInfo.isDemo && (
                  <Badge variant="secondary" className="text-xs">Demo</Badge>
                )}
                {documentInfo.pages && (
                  <Badge variant="outline" className="text-xs">{documentInfo.pages} pages</Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center - Document info (mobile) */}
        {documentInfo && (
          <div className="md:hidden flex items-center space-x-2 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span className="max-w-[150px] truncate">{documentInfo.filename}</span>
            {documentInfo.isDemo && (
              <Badge variant="secondary" className="text-xs">Demo</Badge>
            )}
          </div>
        )}

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Back to Upload Button */}
          <Button 
            onClick={handleBackToUpload}
            variant="outline" 
            size="sm"
            className="hidden md:flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>New Upload</span>
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="text-left">Navigation</SheetTitle>
              <SheetDescription className="text-left">
                Access navigation links and upload new documents
              </SheetDescription>
              <div className="flex flex-col space-y-4 mt-8">
                {/* Back to Upload in mobile menu */}
                <Button 
                  onClick={() => {
                    handleBackToUpload();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>New Upload</span>
                </Button>
                
                <div className="border-t pt-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AppHeader; 