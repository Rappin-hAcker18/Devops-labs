'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg-primary">
          <div className="max-w-md p-8 bg-dark-bg-card rounded-xl border border-dark-border-primary">
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-dark-text-secondary mb-6">
              We encountered an error while loading the application. Please try refreshing the page.
            </p>
            <div className="space-y-3">
              <button
                onClick={this.resetError}
                className="w-full btn-primary"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full btn-secondary"
              >
                Refresh Page
              </button>
            </div>
            {this.state.error && (
              <details className="mt-4 text-sm text-red-400">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-2 overflow-auto text-xs">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;