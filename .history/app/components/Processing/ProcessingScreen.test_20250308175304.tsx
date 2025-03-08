import { render, screen } from '@testing-library/react';
import { ProcessingScreen } from './ProcessingScreen';

describe('ProcessingScreen', () => {
  it('displays progress percentage', () => {
    render(<ProcessingScreen progress={45} />);
    expect(screen.getByText('45% Complete')).toBeInTheDocument();
  });
});
