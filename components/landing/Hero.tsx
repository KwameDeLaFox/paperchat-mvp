import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, MessageCircle, Sparkles } from 'lucide-react';

const Hero = () => {
  const handleUploadClick = () => {
    window.location.href = '/app';
  };

  const handleDemoClick = () => {
    window.location.href = '/app?demo=true';
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-lg border bg-background px-3 py-1.5 text-sm">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                AI-Powered PDF Chat
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none leading-tight">
                Chat with Your PDFs
                <span className="text-primary"> Instantly</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed leading-relaxed">
                Upload any PDF and ask questions. Get instant, intelligent answers powered by AI. 
                No signup required, no complexity - just upload and start chatting.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Ask any question</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Instant answers</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">No signup required</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button 
                onClick={handleUploadClick}
                size="lg" 
                className="flex items-center space-x-2 px-8"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Your PDF</span>
              </Button>
              <Button 
                onClick={handleDemoClick}
                variant="outline" 
                size="lg"
                className="flex items-center space-x-2 px-8"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Try Sample Document</span>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                <span>No registration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                <span>Instant results</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative max-w-md w-full">
              {/* Main illustration container */}
              <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 shadow-2xl">
                {/* PDF Document */}
                <div className="absolute top-4 left-4 w-16 h-20 bg-white rounded shadow-lg border-2 border-primary/20">
                  <div className="w-full h-1 bg-primary/30 mt-2 mb-1"></div>
                  <div className="w-3/4 h-1 bg-muted mt-1 mb-1"></div>
                  <div className="w-1/2 h-1 bg-muted mt-1"></div>
                </div>

                {/* Chat Interface */}
                <div className="mt-16 space-y-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2 max-w-xs">
                      <p className="text-sm">What is this document about?</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2 max-w-xs">
                      <p className="text-sm">This appears to be a research paper about...</p>
                    </div>
                  </div>

                  {/* Typing indicator */}
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                  <MessageCircle className="h-3 w-3 text-secondary-foreground" />
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl blur-xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 