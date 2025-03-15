'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { useErrorStore } from '@/store/errorStore';
import { AppLogger } from '@/lib/logger';
import { useNetworkStore } from '@/store/networkStore';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (!navigator.onLine) {
      useNetworkStore.getState().setOnline(false);
    }
    useErrorStore.getState().showError({
      code: 'boundary/component-error',
      message: error.message,
      context: { stack: errorInfo.componentStack },
    });
    AppLogger.logError({
      code: 'boundary/component-error',
      message: error.message,
      context: { stack: errorInfo.componentStack },
      timestamp: new Date(),
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
