import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { useErrorStore } from '@/store/errorStore';
import { LandingScreen } from '@/components/LandingScreen/LandingScreen';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/store/store', () => ({
  useStore: jest.fn(),
}));

jest.mock('@/store/errorStore', () => ({
  useErrorStore: jest.fn(),
}));

describe('LandingScreen', () => {
  const mockRouterPush = jest.fn();
  const mockSetUserDetails = jest.fn();
  const mockSetEpamFacts = jest.fn();
  const mockShowError = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useStore as unknown as jest.Mock).mockReturnValue({
      setUserDetails: mockSetUserDetails,
      setEpamFacts: mockSetEpamFacts,
    });
    (useErrorStore as unknown as jest.Mock).mockReturnValue({
      showError: mockShowError,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form and submits with valid input', async () => {
    render(<LandingScreen />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Social Media Handle/i), {
      target: { value: 'johndoe' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
      expect(mockSetUserDetails).toHaveBeenCalledWith({
        fullName: 'John Doe',
        socialHandle: 'johndoe',
      });
      expect(mockRouterPush).toHaveBeenCalledWith('/camera');
    });
  });

  it('displays an error when fetching facts fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Failed to fetch'))) as jest.Mock;

    render(<LandingScreen />);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith({
        code: 'GENERAL.UNEXPECTED',
        message: 'Failed to load EPAM facts',
        context: { stack: expect.any(String) },
      });
    });
  });

  it('does not submit the form with empty input', () => {
    render(<LandingScreen />);

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    expect(mockSetUserDetails).not.toHaveBeenCalled();
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('removes "@" from social handle input', () => {
    render(<LandingScreen />);

    fireEvent.change(screen.getByLabelText(/Social Media Handle/i), {
      target: { value: '@johndoe' },
    });

    expect(screen.getByLabelText(/Social Media Handle/i)).toHaveValue('johndoe');
  });
});
