import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorPage from './ErrorPage';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ErrorPage', () => {
  const mockError = new Error('Test Error');
  const mockReset = jest.fn();
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('displays error message and buttons', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    expect(screen.getByText('Test Error')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Return Home')).toBeInTheDocument();
  });

  it('calls reset callback', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    fireEvent.click(screen.getByText('Try Again'));
    expect(mockReset).toHaveBeenCalled();
  });

  it('navigates home', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    fireEvent.click(screen.getByText('Return Home'));
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('shows error digest when available', () => {
    const errorWithDigest = { ...mockError, digest: '12345' };
    render(<ErrorPage error={errorWithDigest} reset={mockReset} />);

    expect(screen.getByText('Error ID:')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
  });
});
