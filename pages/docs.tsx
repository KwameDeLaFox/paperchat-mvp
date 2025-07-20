import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Book, Zap, Shield } from 'lucide-react';

export default function Docs() {
  return (
    <>
      <Head>
        <title>Documentation - PaperChat</title>
        <meta name="description" content="API documentation and developer resources for PaperChat" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="py-20">
          <div className="container px-4 md:px-6">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-16">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Documentation
              </h1>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to integrate PaperChat into your applications
              </p>
            </div>

            {/* Quick Start */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Quick Start</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get up and running in minutes with our simple integration guide
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">API Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Complete API documentation with examples and code snippets
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Book className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Guides</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Step-by-step tutorials and best practices for common use cases
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Security best practices and authentication guidelines
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* API Endpoints */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">API Endpoints</h2>
              <div className="grid gap-6 max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                      <span className="font-mono">/api/upload</span>
                    </CardTitle>
                    <CardDescription>Upload and process a PDF document</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST /api/upload \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@document.pdf"`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                      <span className="font-mono">/api/chat</span>
                    </CardTitle>
                    <CardDescription>Send a message and get AI response</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST /api/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What is this document about?"}'`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                      <span className="font-mono">/api/sample</span>
                    </CardTitle>
                    <CardDescription>Get sample document for testing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X GET /api/sample`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
                <h2 className="text-2xl font-bold mb-4">More Documentation Coming Soon</h2>
                <p className="text-muted-foreground mb-6">
                  We're working on comprehensive documentation, SDKs, and integration guides
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link href="/app">Try the API</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/contact">Request Features</Link>
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