import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Crop } from './Crop';
import { useStore } from '@/store/store';
import { useRouter } from 'next/navigation';

// Mock useStore and useRouter hooks
jest.mock('@/store/store', () => ({
  useStore: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock ReactCrop to simplify testing
jest.mock('react-image-crop', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='react-crop'>{children}</div>
  ),
}));

describe('Crop Component', () => {
  const mockSetImageUrl = jest.fn();
  const mockPush = jest.fn();
  const testImage = 'data:image/jpeg;base64,test-image';

  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      setImageUrl: mockSetImageUrl,
      imageUrl: testImage,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockSetImageUrl.mockClear();
    mockPush.mockClear();
  });

  it('renders image and controls', () => {
    render(<Crop />);

    expect(screen.getByTestId('react-crop')).toBeInTheDocument();
    expect(screen.getByAltText('Edit')).toHaveAttribute('src', testImage);
    expect(screen.getByText('Apply Crop')).toBeDisabled();
  });

  it('enables apply button after crop selection', async () => {
    render(<Crop />);

    // Simulate crop selection
    fireEvent.click(screen.getByText('Apply Crop'));

    await waitFor(() => {
      expect(mockSetImageUrl).not.toHaveBeenCalled();
    });
  });

  it('shows processing state during crop', async () => {
    render(<Crop />);

    fireEvent.click(screen.getByText('Apply Crop'));

    expect(screen.getByText('Processing...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    });
  });

  it('maintains responsive layout', () => {
    render(<Crop />);

    const container = screen.getByTestId('react-crop').parentElement;
    expect(container).toHaveClass('max-w-md');
    expect(container).toHaveClass('max-h-[60vh]');
  });

  it('shows mobile-friendly controls', () => {
    render(<Crop />);

    expect(screen.getByText('Drag to adjust crop')).toBeInTheDocument();
    const controls = screen.getByRole('button', {
      name: 'Apply Crop',
    }).parentElement;
    expect(controls).toHaveClass('flex-col');
    expect(controls).toHaveClass('sm:flex-row');
  });
});
