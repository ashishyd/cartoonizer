import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock canvas methods
window.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  drawImage: jest.fn(),
  fillRect: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
}));

window.HTMLCanvasElement.prototype.toDataURL = jest.fn(
  () => 'data:image/jpeg;base64,mocked'
);

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock createObjectURL
window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();
