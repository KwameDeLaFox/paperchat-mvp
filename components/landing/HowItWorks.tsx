import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, MessageSquare, Sparkles } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Your PDF",
      description: "Simply drag and drop your PDF file or click to browse. We support files up to 10MB with instant processing.",
      details: [
        "Drag & drop or click to upload",
        "Supports all PDF formats",
        "Instant text extraction",
        "No file size limits for most documents"
      ]
    },
    {
      number: "02",
      icon: MessageSquare,
      title: "Ask Questions",
      description: "Type any question about your document content. Our AI understands context and provides intelligent responses.",
      details: [
        "Natural language questions",
        "Context-aware responses",
        "Follow-up questions supported",
        "Real-time chat interface"
      ]
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Get Instant Answers",
      description: "Receive accurate, relevant answers powered by advanced AI. No waiting, no complexity - just results.",
      details: [
        "AI-powered responses",
        "Instant results",
        "Accurate and relevant",
        "Easy to understand"
      ]
    }
  ];

  return (
    <section className="py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl leading-tight">
            How It Works
          </h2>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed leading-relaxed">
            Get started in three simple steps. No complex setup, no learning curve - just upload and start chatting.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/20 to-primary/20 z-0" 
                     style={{ width: 'calc(100% - 3rem)', left: 'calc(100% - 1.5rem)' }} />
              )}
              
              <Card className="relative z-10 group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm h-full">
                <CardHeader className="text-center pb-6">
                  <div className="relative mx-auto mb-8">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-base leading-relaxed mb-6">
                    {step.description}
                  </CardDescription>
                  
                  {/* Feature list */}
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center justify-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-xl font-semibold mb-3">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who are already chatting with their PDFs
              </p>
              <button 
                onClick={() => window.location.href = '/app'}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Start Chatting Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 