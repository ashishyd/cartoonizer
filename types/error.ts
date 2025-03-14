export type AppError = {
  code: string;
  message: string;
  context?: Record<string, unknown>;
  timestamp: Date;
};

export const ERROR_TYPES = {
  CAMERA: {
    ACCESS_DENIED: 'camera/access-denied',
    INIT_FAILED: 'camera/init-failed',
  },
  CAPTURE: {
    FAILED: 'capture/failed',
  },
  GENERAL: {
    UNEXPECTED: 'general/unexpected-error',
  },
} as const;
