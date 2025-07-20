import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Target, Zap } from 'lucide-react';

export default function About() {
  return (
    <>
      <Head>
        <title>About - PaperChat</title>
        <meta name="description" content="Learn about PaperChat's mission to make document interaction seamless and intelligent" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="py-20">
          <div className="container px-4 md:px-6">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-16">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                About PaperChat
              </h1>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We're on a mission to transform how people interact with documents through the power of AI
              </p>
            </div>

            {/* Mission Section */}
            <div className="grid gap-8 md:grid-cols-2 items-center mb-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground text-lg">
                  PaperChat was born from a simple observation: documents contain valuable information, 
                  but accessing and understanding that information can be frustrating and time-consuming.
                </p>
                <p className="text-muted-foreground text-lg">
                  We believe that every document should be conversational. Whether it's a research paper, 
                  a legal contract, or a technical manual, you should be able to ask questions and get 
                  intelligent answers instantly.
                </p>
                <div className="flex items-center space-x-2 text-primary">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">Built with love for document lovers</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Why PaperChat?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>No more endless scrolling through documents</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>Get answers to specific questions instantly</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>Understand complex documents with AI assistance</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>Save time and focus on what matters</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>Simplicity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      We believe the best technology is invisible. PaperChat works seamlessly 
                      in the background, letting you focus on your work.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      We're committed to providing accurate, reliable answers. Your trust 
                      is our most valuable asset.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>Accessibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Everyone should have access to powerful AI tools. That's why we offer 
                      our core features completely free.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Team Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">The Team</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-primary">👨‍💻</span>
                    </div>
                    <CardTitle>Developer</CardTitle>
                    <CardDescription>Full-stack engineer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Passionate about building intuitive user experiences and scalable systems.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-primary">🎨</span>
                    </div>
                    <CardTitle>Designer</CardTitle>
                    <CardDescription>UX/UI specialist</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Focused on creating beautiful, accessible, and user-friendly interfaces.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-primary">🚀</span>
                    </div>
                    <CardTitle>Product Manager</CardTitle>
                    <CardDescription>Product strategist</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Dedicated to understanding user needs and building the right solutions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
                <h2 className="text-2xl font-bold mb-4">Join Us on This Journey</h2>
                <p className="text-muted-foreground mb-6">
                  We're just getting started. Help us shape the future of document interaction.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/app">Try PaperChat</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/contact">Get in Touch</Link>
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