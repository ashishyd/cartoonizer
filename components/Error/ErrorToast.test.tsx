import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorToast } from './ErrorToast';
import { useErrorStore } from '@/store/errorStore';

jest.mock('@/store/errorStore');

describe('ErrorToast', () => {
  it('renders error message when error exists', () => {
    (useErrorStore as unknown as jest.Mock).mockReturnValue({
      error: { code: '404', message: 'Not Found' },
      clearError: jest.fn(),
    });
    render(<ErrorToast />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('does not render when there is no error', () => {
    (useErrorStore as unknown as jest.Mock).mockReturnValue({
      error: null,
      clearError: jest.fn(),
    });
    const { container } = render(<ErrorToast />);
    expect(container.firstChild).toBeNull();
  });

  it('calls clearError when dismiss button is clicked', () => {
    const clearErrorMock = jest.fn();
    (useErrorStore as unknown as jest.Mock).mockReturnValue({
      error: { code: '500', message: 'Internal Server Error' },
      clearError: clearErrorMock,
    });
    render(<ErrorToast />);
    fireEvent.click(screen.getByLabelText('Dismiss error'));
    expect(clearErrorMock).toHaveBeenCalled();
  });
});
