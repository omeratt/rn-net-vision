/** @jsxImportSource preact */
import { ComponentChildren, VNode } from 'preact';
import { useErrorBoundary } from 'preact/hooks';
import { Button } from './Button';
import { ScrollFadeContainer } from './ScrollFadeContainer';

interface ErrorBoundaryProps {
  children: ComponentChildren;
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps): VNode => {
  const [errorState, resetError] = useErrorBoundary((err: Error) => {
    console.error('Error caught by boundary:', err);
  });

  if (errorState) {
    const error = errorState as Error;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Something went wrong
          </h1>
          <ScrollFadeContainer
            className="text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded mb-4 overflow-auto max-h-60"
            fadeHeight={60}
          >
            <div className="font-medium mb-2">Error: {error.message}</div>
            {error.stack && (
              <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {error.stack}
              </div>
            )}
          </ScrollFadeContainer>
          <Button
            onClick={() => {
              resetError();
              window.location.reload();
            }}
            variant="primary"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
