import { NextPageContext } from 'next';
import { ErrorProps } from 'next/error';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

interface CustomErrorProps extends ErrorProps {
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode, hasGetInitialPropsRun, err }: CustomErrorProps) {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">
          {statusCode || 'Error'}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {statusCode
            ? `A ${statusCode} error occurred on server`
            : 'An error occurred on client'}
        </p>
        <Button
          onClick={() => window.location.reload()}
          size="lg"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Page
        </Button>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err, asPath }: NextPageContext) => {
  const errorInitialProps = {
    hasGetInitialPropsRun: true,
    err,
  };

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  if (res) {
    // Running on the server, and response object is available.
    //
    // Next.js will set an err property on the response if
    // there was a rendering error (that is, when `_next/error` is
    // called in the render phase).
    if (res.statusCode === 404) {
      // Opinionated: do not record an error in Sentry for 404
      // https://middleware.call-stack.com/
      return errorInitialProps;
    }
    // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
    // getInitialProps has run
    if (err) {
      return errorInitialProps;
    }
  } else {
    // Running on the client (browser).
    //
    // Next.js will provide an err property if there was an error during the
    // rendering process.
    if (err) {
      return errorInitialProps;
    }
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug in Next.js, so record it in Sentry
  return errorInitialProps;
};

export default Error; 