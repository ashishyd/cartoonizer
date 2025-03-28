import { render, screen, waitFor } from '@testing-library/react';
import { useStore } from '@/store/store';
import { FactsCarousel } from '@/components/FactsCarousel/FactsCarousel';

jest.mock('@/store/store', () => ({
  useStore: jest.fn(),
}));

describe('FactsCarousel', () => {
  const mockSetCurrentFactIndex = jest.fn();

  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      epamFacts: ['Fact 1', 'Fact 2', 'Fact 3'],
      currentFactIndex: 0,
      setCurrentFactIndex: mockSetCurrentFactIndex,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the first fact initially', () => {
    render(<FactsCarousel />);
    expect(screen.getByText('Fact 1')).toBeInTheDocument();
  });

  it('cycles through facts every 5 seconds', async () => {
    jest.useFakeTimers();
    render(<FactsCarousel />);

    jest.advanceTimersByTime(5000);
    await waitFor(() => expect(mockSetCurrentFactIndex).toHaveBeenCalledWith(1));

    jest.advanceTimersByTime(5000);
    await waitFor(() => expect(mockSetCurrentFactIndex).toHaveBeenCalledWith(2));

    jest.advanceTimersByTime(5000);
    await waitFor(() => expect(mockSetCurrentFactIndex).toHaveBeenCalledWith(0));

    jest.useRealTimers();
  });

  it('renders no facts when epamFacts is empty', () => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      epamFacts: [],
      currentFactIndex: 0,
      setCurrentFactIndex: mockSetCurrentFactIndex,
    });

    render(<FactsCarousel />);
    expect(screen.queryByText('Fact 1')).not.toBeInTheDocument();
  });

  it('changes fact when a dot is clicked', () => {
    render(<FactsCarousel />);
    const secondDot = screen.getAllByRole('button')[1];
    secondDot.click();
    expect(mockSetCurrentFactIndex).toHaveBeenCalledWith(1);
  });
});
