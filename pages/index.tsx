import React from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>PaperChat - Chat with Your PDFs Instantly</title>
        <meta name="description" content="Upload any PDF and ask questions. Get instant, intelligent answers powered by AI. No signup required, no complexity - just upload and start chatting." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
        </main>
        <Footer />
      </div>
    </>
  );
} 