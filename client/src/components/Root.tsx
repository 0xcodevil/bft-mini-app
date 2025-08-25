import { useEffect } from 'react';
import { App } from '@/components/App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

export function Root() {
  useEffect(() => {
    const blockInspect = (e: KeyboardEvent) => {
      if (e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", e => e.preventDefault());
    document.addEventListener("keydown", blockInspect);

    return () => {
      document.removeEventListener("contextmenu", e => e.preventDefault());
      document.removeEventListener("keydown", blockInspect);
    };
  }, []);

  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <App />
    </ErrorBoundary>
  );
}
