import { render, screen, waitFor } from '@testing-library/react';
import Camera from './Camera';

jest.mock('../../lib/faceDetection');
jest.mock('use-sound');

describe('Camera', () => {
  beforeAll(() => {
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      get() { return () => Promise.resolve(); },
    });
  });

  it('automatically detects faces', async () => {
    const mockDetectFaces = jest.fn().mockResolvedValue([
      { box: { x: 100, y: 100, width: 200, height: 200 }, videoWidth: 1280, videoHeight: 720 }
    ]);
    (require('../../lib/faceDetection').detectFaces as jest.Mock) = mockDetectFaces;

    render(<Camera onCapture={jest.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('face-overlay')).toBeInTheDocument();
    });
  });

  it('triggers countdown when face centered', async () => {
    const { rerender } = render(<Camera onCapture={jest.fn()} />);
    
    // Simulate face detection update
    (require('../../lib/faceDetection').detectFaces as jest.Mock) = jest.fn().mockResolvedValue([
      { box: { x: 600, y: 300, width: 200, height: 200 }, videoWidth: 1280, videoHeight: 720 }
    ]);
    
    rerender(<Camera onCapture={jest.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});