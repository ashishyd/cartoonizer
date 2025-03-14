import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Camera } from './Camera';
import { act } from 'react-dom/test-utils';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { useStore } from '../../store/store';
import { useRouter } from 'next/navigation';

jest.mock('react-webcam', () => ({
  __esModule: true,
  default: (props: { className?: string; videoRef?: React.RefObject<HTMLVideoElement> }) => (
    <video data-testid='mock-webcam' className={props.className} ref={props.videoRef} />
  ),
}));

jest.mock('@/hooks/useFaceDetection', () => ({
  useFaceDetection: jest.fn(),
}));

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../store/store', () => ({
  useStore: () => ({
    setImageUrl: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Camera', () => {
  beforeEach(() => {
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
    render(<Camera />);

    expect(screen.getByTestId('mock-webcam')).toBeInTheDocument();
    expect(screen.getByText('capture_text')).toBeInTheDocument();
  });

  it('shows face detection overlay', async () => {
    (useFaceDetection as jest.Mock).mockReturnValue({
      faces: [
        {
          box: { x: 100, y: 100, width: 200, height: 200 },
          imageWidth: 1280,
          imageHeight: 720,
        },
      ],
    });

    render(<Camera />);

    await waitFor(() => {
      const faceOverlay = screen.getByTestId('face-overlay');
      expect(faceOverlay).toBeInTheDocument();
      expect(faceOverlay).toHaveStyle('left: 7.8125%');
      expect(faceOverlay).toHaveStyle('top: 13.8889%');
    });
  });

  it('handles capture action with flash effect', async () => {
    const mockSetImageUrl = jest.fn();
    const mockPush = jest.fn();
    (useStore as unknown as jest.Mock).mockReturnValue({ setImageUrl: mockSetImageUrl });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<Camera />);

    const captureButton = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(captureButton);
    });

    expect(mockSetImageUrl).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/crop');
    expect(screen.getByTestId('mock-webcam')).toHaveClass('animate-camera-flash');
  });

  it('adapts aspect ratio for mobile portrait', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(orientation: portrait)',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    render(<Camera />);

    const webcam = screen.getByTestId('mock-webcam');
    expect(webcam).toHaveClass('object-cover');
  });

  it('shows camera permission error state', async () => {
    render(<Camera />);

    await waitFor(() => {
      expect(screen.getByText('camera_access_error_title')).toBeInTheDocument();
    });
  });

  it('handles multiple face detection', async () => {
    (useFaceDetection as jest.Mock).mockReturnValue({
      faces: [
        {
          box: { x: 100, y: 100, width: 200, height: 200 },
          imageWidth: 1280,
          imageHeight: 720,
        },
        {
          box: { x: 400, y: 300, width: 200, height: 200 },
          imageWidth: 1280,
          imageHeight: 720,
        },
      ],
    });

    render(<Camera />);

    await waitFor(() => {
      const overlays = screen.getAllByTestId('face-overlay');
      expect(overlays.length).toBe(2);
    });
  });

  it('shows viewfinder overlay', async () => {
    render(<Camera />);

    expect(screen.getByTestId('viewfinder-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('viewfinder-svg')).toBeInTheDocument();
  });
});
