import { AppLogger } from './logger';
import type { AppError } from '@/types/error';

describe('AppLogger', () => {
  describe('logError', () => {
    it('logs error with correct structure', () => {
      const error: AppError = {
        code: '500',
        message: 'Internal Server Error',
        context: { userId: '123' },
        timestamp: new Date(),
      };
      console.error = jest.fn();

      AppLogger.logError(error);

      expect(console.error).toHaveBeenCalledWith('Application Error:', {
        code: error.code,
        message: error.message,
        context: error.context,
        timestamp: error.timestamp.toISOString(),
      });
    });

    it('handles missing context gracefully', () => {
      const error: AppError = {
        code: '404',
        message: 'Not Found',
        context: undefined,
        timestamp: new Date(),
      };
      console.error = jest.fn();

      AppLogger.logError(error);

      expect(console.error).toHaveBeenCalledWith('Application Error:', {
        code: error.code,
        message: error.message,
        context: error.context,
        timestamp: error.timestamp.toISOString(),
      });
    });
  });

  describe('logToConsole', () => {
    it('logs message with context', () => {
      const message = 'Test message';
      const context = { key: 'value' };
      console.log = jest.fn();

      AppLogger.logToConsole(message, context);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining(message), context);
    });

    it('logs message without context', () => {
      const message = 'Test message';
      console.log = jest.fn();

      AppLogger.logToConsole(message);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining(message), undefined);
    });
  });
});
