import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';
import React from 'react';

const ThrowError = ({ error }: { error: Error }) => {
  throw error;
};

it('renders error message when an error is thrown', () => {
  const error = new Error('Test error');
  render(
    <ErrorBoundary>
      <ThrowError error={error} />
    </ErrorBoundary>
  );
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});

it('renders children when no error is thrown', () => {
  render(
    <ErrorBoundary>
      <div>Child component</div>
    </ErrorBoundary>
  );
  expect(screen.getByText(/child component/i)).toBeInTheDocument();
});

it('resets error state when reset button is clicked', () => {
  const error = new Error('Test error');
  render(
    <ErrorBoundary>
      <ThrowError error={error} />
    </ErrorBoundary>
  );
  fireEvent.click(screen.getByText(/reset/i));
  expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/child component/i)).toBeInTheDocument();
});
