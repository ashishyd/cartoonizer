import { render, screen, waitFor } from '@testing-library/react';
import { Cropper } from './Cropper';

global.URL.createObjectURL = jest.fn();

describe('Cropper', () => {
  const mockOnComplete = jest.fn();
  const testImage = 'data:image/jpeg;base64,test';

  it('automatically processes after crop change', async () => {
    render(<Cropper imageSrc={testImage} onComplete={mockOnComplete} />);

    await waitFor(
      () => {
        expect(mockOnComplete).toHaveBeenCalledTimes(1);
      },
      { timeout: 2000 }
    );
  });

  it('shows processing state', async () => {
    render(<Cropper imageSrc={testImage} onComplete={mockOnComplete} />);
    expect(screen.getByText(/Auto-processing/)).toBeInTheDocument();
  });
});
