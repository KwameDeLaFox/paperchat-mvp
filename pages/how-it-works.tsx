import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, MessageSquare, Sparkles, Zap, Shield, Brain } from 'lucide-react';

export default function HowItWorks() {
  return (
    <>
      <Head>
        <title>How It Works - PaperChat</title>
        <meta name="description" content="Learn how PaperChat transforms your PDFs into conversational experiences with AI" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="py-20">
          <div className="container px-4 md:px-6">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-16">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                How PaperChat Works
              </h1>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover the magic behind our AI-powered PDF chat technology
              </p>
            </div>

            {/* Process Steps */}
            <div className="grid gap-8 md:grid-cols-3 mb-16">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>1. Upload Your PDF</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Simply drag and drop your PDF file or click to browse. Our system instantly extracts all text content while preserving the document structure.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>2. AI Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our advanced AI analyzes your document, understands context, and prepares to answer any questions you might have about the content.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>3. Start Chatting</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Ask any question about your document and receive instant, intelligent responses. The AI understands context and provides relevant answers.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Technology Section */}
            <div className="grid gap-8 md:grid-cols-2 items-center mb-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Powered by Advanced AI</h2>
                <p className="text-muted-foreground text-lg">
                  PaperChat uses state-of-the-art natural language processing to understand your documents and provide intelligent responses.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Lightning-fast processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Secure and private</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-primary" />
                    <span>Context-aware responses</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="bg-background rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Example Interaction</h3>
                    <div className="space-y-2 text-sm">
                      <div className="bg-primary text-primary-foreground rounded-lg p-2 ml-8">
                        "What are the main findings of this research?"
                      </div>
                      <div className="bg-muted rounded-lg p-2 mr-8">
                        "The research identifies three key findings: [AI response based on document content]"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
                <h2 className="text-2xl font-bold mb-4">Ready to Try It Yourself?</h2>
                <p className="text-muted-foreground mb-6">
                  Experience the power of AI-powered PDF chat today
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/app">Start Chatting Now</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
} 