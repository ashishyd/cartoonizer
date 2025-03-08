import { render, screen } from '@testing-library/react';
import { ResultScreen } from './ResultScreen';

describe('ResultScreen', () => {
  it('displays QR code and image', () => {
    render(<ResultScreen imageUrl="test.jpg" onRetry={() => {}} />);
    expect(screen.getByAltText('Result')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /qr-code/ })).toBeInTheDocument();
  });
});
