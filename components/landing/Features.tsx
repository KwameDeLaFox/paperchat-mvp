import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  Zap, 
  Shield, 
  Brain,
  FileText,
  Users
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Ask Any Question",
      description: "Get instant answers to any question about your PDF content. From simple queries to complex analysis, our AI understands context and provides relevant responses.",
      color: "text-blue-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Upload your PDF and start chatting immediately. No waiting, no processing delays - get answers in seconds, not minutes.",
      color: "text-yellow-600"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your documents are processed securely and never stored permanently. We prioritize your privacy and data protection.",
      color: "text-green-600"
    },
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced AI that understands context, extracts key insights, and provides intelligent responses based on your document content.",
      color: "text-purple-600"
    },
    {
      icon: FileText,
      title: "All PDF Types",
      description: "Works with research papers, manuals, reports, contracts, and any other PDF document. No matter the format or complexity.",
      color: "text-red-600"
    },
    {
      icon: Users,
      title: "No Registration",
      description: "Start using PaperChat immediately without creating an account. Upload, chat, and get answers - it's that simple.",
      color: "text-indigo-600"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl leading-tight">
            Everything You Need to Chat with PDFs
          </h2>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed leading-relaxed">
            Powerful features designed to make your document interactions seamless and intelligent.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm h-full">
              <CardHeader className="pb-6">
                <div className={`w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl leading-tight">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center rounded-lg border bg-background px-6 py-3 text-sm">
            <Shield className="mr-3 h-4 w-4 text-green-600" />
            <span className="text-muted-foreground">
              Trusted by researchers, students, and professionals worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features; 