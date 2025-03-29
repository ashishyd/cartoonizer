import type { AppError } from '@/types/error';

export class AppLogger {
  static logError(error: AppError) {
    // Send to error monitoring service
    console?.error('Application Error:', {
      code: error.code,
      message: error.message,
      context: error.context,
      timestamp: error.timestamp.toISOString(),
    });

    // TODO: Add your error reporting service integration
    // Sentry.captureException(error);
  }

  static logToConsole(message: string, context?: Record<string, unknown>) {
    console.log(`[${new Date().toISOString()}] ${message}`, context);
  }
}
