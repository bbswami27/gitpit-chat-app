import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught GitPit React error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Could not clear localStorage', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen w-screen p-6 bg-slate-900 text-white text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-black">
            🛡️
          </div>
          <h1 className="text-xl font-extrabold text-emerald-400">GitPit Mobile Recovery</h1>
          <p className="text-xs text-slate-300 max-w-sm">
            An unexpected glitch occurred on startup. Tap below to reset local state & reload cleanly.
          </p>
          <div className="p-3 bg-slate-800 rounded-xl text-[11px] font-mono text-rose-300 max-w-xs overflow-auto">
            {this.state.error?.toString()}
          </div>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg cursor-pointer active:scale-95"
          >
            🔄 Reset & Launch GitPit Fresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
