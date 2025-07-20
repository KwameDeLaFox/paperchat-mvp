import type { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import '@/styles/globals.css';
import '@/utils/polyfills';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button
          onClick={resetErrorBoundary}
          size="lg"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </div>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
} 