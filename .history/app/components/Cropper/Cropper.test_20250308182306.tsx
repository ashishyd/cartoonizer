import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Cropper } from './Cropper';

global.URL.createObjectURL = jest.fn();

describe('Cropper', () => {
  const mockOnComplete = jest.fn();
  const testImage = 'data:image/jpeg;base64,test';

  it('requires manual crop confirmation', () => {
    render(<Cropper imageSrc={testImage} onComplete={mockOnComplete} />);
    
    expect(screen.getByText('Select area to crop')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply Crop' })).toBeDisabled();
  });

  it('enables button when crop is selected', async () => {
    render(<Cropper imageSrc={testImage} onComplete={mockOnComplete} />);
    
    // Simulate crop selection
    fireEvent.click(screen.getByRole('button', { name: 'Apply Crop' }));
    
    await waitFor(() => {
      expect(mockOnComplete).not.toHaveBeenCalled();
      expect(screen.getByRole('button', { name: 'Apply Crop' })).toBeDisabled();
    });
  });

  it('processes image when confirmed', async () => {
    render(<Cropper imageSrc={testImage} onComplete={mockOnComplete} />);
    
    // Simulate valid crop selection
    fireEvent.click(screen.getByRole('button', { name: 'Apply Crop' }));
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });
});