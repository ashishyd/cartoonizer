import { render, screen, fireEvent } from '@testing-library/react';
import { ResultScreen } from './ResultScreen';

jest.mock('../hooks/useShortenUrl');

describe('ResultScreen', () => {
  it('toggles QR code visibility', () => {
    render(<ResultScreen imageUrl="test.jpg" onRetry={() => {}} />);

    fireEvent.click(screen.getByText('Show QR Code'));
    expect(screen.getByText('Hide QR Code')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hide QR Code'));
    expect(screen.getByText('Show QR Code')).toBeInTheDocument();
  });

  it('shows error message when QR generation fails', async () => {
    // Mock failed API response
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed'));

    render(<ResultScreen imageUrl="test.jpg" onRetry={() => {}} />);
    fireEvent.click(screen.getByText('Show QR Code'));

    await screen.findByText('Failed to generate QR code');
  });
});
