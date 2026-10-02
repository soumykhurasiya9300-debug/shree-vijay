import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Shree Vijay Showroom ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      window.location.reload();
    } catch {
      this.setState({ hasError: false, error: null });
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0909] text-[#F4EEE4] flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full bg-[#181516] border border-[#B89A5A]/40 p-8 shadow-2xl rounded-xs">
            <div className="w-14 h-14 rounded-full bg-[#4A1724]/60 border border-[#B89A5A]/50 flex items-center justify-center mx-auto mb-5 text-[#D1B875]">
              <AlertCircle className="w-7 h-7" />
            </div>

            <span className="text-[10px] uppercase font-mono tracking-[0.28em] text-[#B89A5A] block mb-2">
              SHREE VIJAY SHOWROOM · JABALPUR
            </span>

            <h1 className="font-display text-2xl font-bold text-[#F4EEE4] mb-3">
              Momentary Atelier Pause
            </h1>

            <p className="text-sm text-[#BDB3A5] font-light mb-6 leading-relaxed">
              We experienced a brief display interruption while loading the couture collections. Please tap below to refresh the showroom.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="w-full py-3 px-6 bg-[#4A1724] hover:bg-[#351019] text-[#F4EEE4] border border-[#B89A5A]/60 font-semibold text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4 text-[#D1B875]" />
              <span>Reload Showroom</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
