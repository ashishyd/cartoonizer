import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Camera from './Camera';
import { act } from 'react-dom/test-utils';

// Mock Webcam and Face Detection
jest.mock('react-webcam', () => ({
  __esModule: true,
  default: (props: any) => (
    <video
      data-testid="mock-webcam"
      className={props.className}
      ref={props.videoRef}
    />
  ),
}));

jest.mock('@/hooks/useFaceDetection', () => ({
  useFaceDetection: () => ({
    faces: [
      {
        box: { x: 100, y: 100, width: 200, height: 200 },
        videoWidth: 1280,
        videoHeight: 720,
      },
    ],
  }),
}));

describe('Camera', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(orientation: portrait)',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  });

  it('renders camera interface with responsive view', async () => {
    render(<Camera onCapture={jest.fn()} />);

    // Verify main elements
    expect(screen.getByTestId('mock-webcam')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /capture/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/center your face/i)).toBeInTheDocument();
  });

  it('shows face detection overlay', async () => {
    render(<Camera onCapture={jest.fn()} />);

    await waitFor(() => {
      const faceOverlay = screen.getByTestId('face-overlay');
      expect(faceOverlay).toBeInTheDocument();
      expect(faceOverlay).toHaveStyle('left: 7.8125%');
      expect(faceOverlay).toHaveStyle('top: 13.8889%');
    });
  });

  it('handles capture action with flash effect', async () => {
    const mockCapture = jest.fn();
    render(<Camera onCapture={mockCapture} />);

    const captureButton = screen.getByRole('button', { name: /capture/i });

    await act(async () => {
      fireEvent.click(captureButton);
    });

    expect(mockCapture).toHaveBeenCalled();
    expect(screen.getByTestId('mock-webcam')).toHaveClass(
      'animate-camera-flash'
    );
  });

  it('adapts aspect ratio for mobile portrait', async () => {
    // Force portrait orientation
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(orientation: portrait)',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    render(<Camera onCapture={jest.fn()} />);

    const webcam = screen.getByTestId('mock-webcam');
    expect(webcam).toHaveClass('object-cover');
  });

  it('shows camera permission error state', async () => {
    render(<Camera onCapture={jest.fn()} />);

    // Simulate camera not ready
    await waitFor(() => {
      expect(screen.getByText(/camera access required/i)).toBeInTheDocument();
    });
  });

  it('handles multiple face detection', async () => {
    // Override mock to return multiple faces
    jest.mock('@/hooks/useFaceDetection', () => ({
      useFaceDetection: () => ({
        faces: [
          {
            box: { x: 100, y: 100, width: 200, height: 200 },
            videoWidth: 1280,
            videoHeight: 720,
          },
          {
            box: { x: 400, y: 300, width: 200, height: 200 },
            videoWidth: 1280,
            videoHeight: 720,
          },
        ],
      }),
    }));

    render(<Camera onCapture={jest.fn()} />);

    await waitFor(() => {
      const overlays = screen.getAllByTestId('face-overlay');
      expect(overlays.length).toBe(2);
    });
  });

  it('shows viewfinder overlay', async () => {
    render(<Camera onCapture={jest.fn()} />);

    expect(screen.getByTestId('viewfinder-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('viewfinder-svg')).toBeInTheDocument();
  });
});
