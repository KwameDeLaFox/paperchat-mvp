import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Pricing - PaperChat</title>
        <meta name="description" content="Simple, transparent pricing for PaperChat" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="py-20">
          <div className="container px-4 md:px-6">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-16">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Simple Pricing
              </h1>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start chatting with your PDFs for free. No hidden fees, no surprises.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {/* Free Tier */}
              <Card className="relative">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <div className="text-4xl font-bold">$0</div>
                  <CardDescription>Perfect for getting started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Unlimited PDF uploads</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Unlimited questions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>AI-powered responses</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>No registration required</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Basic support</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/app">Get Started Free</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Tier */}
              <Card className="relative border-primary">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>Most Popular</span>
                  </div>
                </div>
                <CardHeader className="text-center pt-6">
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <div className="text-4xl font-bold">$9<span className="text-lg text-muted-foreground">/month</span></div>
                  <CardDescription>For power users and teams</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Everything in Free</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Priority processing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Advanced AI models</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Document history</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link href="/app">Start Pro Trial</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Tier */}
              <Card className="relative">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <div className="text-4xl font-bold">Custom</div>
                  <CardDescription>For large organizations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Dedicated support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>SLA guarantees</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>On-premise options</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="mt-20 text-center">
              <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
              <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto text-left">
                <div className="space-y-2">
                  <h3 className="font-semibold">Is PaperChat really free?</h3>
                  <p className="text-muted-foreground">Yes! Our free tier includes unlimited PDF uploads and questions with no registration required.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">What file types do you support?</h3>
                  <p className="text-muted-foreground">Currently, we support PDF files up to 10MB. We're working on support for other document formats.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Is my data secure?</h3>
                  <p className="text-muted-foreground">Absolutely. We process your documents securely and don't store them permanently. Your privacy is our priority.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Can I cancel anytime?</h3>
                  <p className="text-muted-foreground">Yes, you can cancel your Pro subscription at any time. No long-term commitments required.</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
                <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-muted-foreground mb-6">
                  Join thousands of users who are already chatting with their PDFs
                </p>
                <Button asChild size="lg">
                  <Link href="/app">Start Free Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
} 