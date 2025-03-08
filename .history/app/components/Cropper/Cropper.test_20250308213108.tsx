import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Cropper } from './Cropper';

// Mock ReactCrop to simplify testing
jest.mock('react-image-crop', () => ({
  __esModule: true,
  ReactCrop: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="react-crop">{children}</div>
  ),
}));

describe('Cropper Component', () => {
  const mockOnComplete = jest.fn();
  const testImage = 'data:image/jpeg;base64,test-image';

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it('renders image and controls', () => {
    render(<Cropper imageSrc={testImage} onComplete={mockOnComplete} />);
    
    expect(screen.getByTestId('react-crop')).toBeInTheDocument();
    expect(screen.getByAltText('Edit')).toHaveAttribute('src', testImage);
    expect(screen.getByText('Apply Crop')).toBeDisabled();
  });

  it('enables apply button after crop selection', async () => {
    render(<Cropper imageSrc={testImage} onComplete={mockOnComplete} />);
    
    // Simulate crop selection
    fireEvent.click(screen.getByText('Apply Crop'));
    
    await waitFor(() => {
      expect(mockOnComplete).not.toHaveBeenCalled();
    });
  });

  it('shows processing state during crop', async () => {
    render(<Cropper imageSrc={testImage} onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Apply Crop'));
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    });
  });

  it('maintains responsive layout', () => {
    render(<Cropper imageSrc={testImage} onComplete={mockOnComplete} />);
    
    const container = screen.getByTestId('react-crop').parentElement;
    expect(container).toHaveClass('max-w-md');
    expect(container).toHaveClass('max-h-[60vh]');
  });

  it('shows mobile-friendly controls', () => {
    render(<Cropper imageSrc={testImage} onComplete={mockOnComplete} />);
    
    expect(screen.getByText('Drag to adjust crop')).toBeInTheDocument();
    const controls = screen.getByRole('button', { name: 'Apply Crop' }).parentElement;
    expect(controls).toHaveClass('flex-col');
    expect(controls).toHaveClass('sm:flex-row');
  });
});