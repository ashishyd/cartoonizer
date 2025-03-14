import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import { ResultScreen } from './ResultScreen';
import { useStore } from '@/store/store';
import { useRouter } from 'next/navigation';

jest.mock('@/store/store');
jest.mock('next/navigation');

describe('ResultScreen', () => {
  it('renders image with correct src', () => {
    (useStore as unknown as jest.Mock).mockReturnValue({ imageUrl: 'test.jpg', reset: jest.fn() });
    render(<ResultScreen />);
    expect(screen.getByAltText('Result')).toHaveAttribute('src', 'test.jpg');
  });

  it('prints the image when print button is clicked', () => {
    window.print = jest.fn();
    (useStore as unknown as jest.Mock).mockReturnValue({ imageUrl: 'test.jpg', reset: jest.fn() });
    render(<ResultScreen />);
    fireEvent.click(screen.getByText('Print'));
    expect(window.print).toHaveBeenCalled();
  });

  it('downloads the image when download button is clicked', () => {
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');
    (useStore as unknown as jest.Mock).mockReturnValue({ imageUrl: 'test.jpg', reset: jest.fn() });
    render(<ResultScreen />);
    fireEvent.click(screen.getByText('Download Photo'));
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

  it('resets and navigates to home when start over button is clicked', () => {
    const resetMock = jest.fn();
    const pushMock = jest.fn();
    (useStore as unknown as jest.Mock).mockReturnValue({ imageUrl: 'test.jpg', reset: resetMock });
    (useRouter as unknown as jest.Mock).mockReturnValue({ push: pushMock });
    render(<ResultScreen />);
    fireEvent.click(screen.getByText('Start Over'));
    expect(resetMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
