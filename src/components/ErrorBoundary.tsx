import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
              <AlertTriangle size={40} className="text-red-400" />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
              <p className="text-gray-400 leading-relaxed">
                We encountered an unexpected error. Don't worry, your data is safe. Try refreshing the page or go back home.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-left">
                <p className="text-xs text-gray-500 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-all"
              >
                <RefreshCw size={18} />
                <span>Refresh Page</span>
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                <Home size={18} />
                <span>Go Home</span>
              </button>
            </div>

            <p className="text-sm text-gray-500">
              If this keeps happening,{' '}
              <a href="mailto:support@aurin.com" className="text-emerald-400 hover:text-emerald-300">
                contact support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
