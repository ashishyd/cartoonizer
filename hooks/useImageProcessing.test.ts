import { renderHook, act } from '@testing-library/react-hooks';
import { useImageProcessing } from './useImageProcessing';
import { useStore } from '@/store/store';
import { addLogo, optimizeImage } from '@/lib/imageUtils';

jest.mock('@/store/store');
jest.mock('@/lib/imageUtils');

describe('useImageProcessing', () => {
  const mockSetImageUrl = jest.fn();
  const mockFullName = 'John Doe';
  const mockSocialHandle = '@johndoe';

  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      fullName: mockFullName,
      socialHandle: mockSocialHandle,
      setImageUrl: mockSetImageUrl,
    });
  });

  it('processes image successfully', async () => {
    const mockImage = 'image-data';
    const mockOutputUrl = 'http://example.com/output.png';
    const mockOptimizedImage = 'optimized-image-data';
    const mockBrandedImage = 'branded-image-data';

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ output_url: mockOutputUrl }),
    });

    (optimizeImage as jest.Mock).mockResolvedValue(mockOptimizedImage);
    (addLogo as jest.Mock).mockResolvedValue(mockBrandedImage);

    const { result, waitForNextUpdate } = renderHook(() => useImageProcessing());

    act(() => {
      result.current.processImage(mockImage);
    });

    await waitForNextUpdate();

    expect(result.current.processedImage).toBe(mockBrandedImage);
    expect(result.current.progress).toBe(100);
    expect(mockSetImageUrl).toHaveBeenCalledWith(mockBrandedImage);
  });

  it('handles errors during image processing', async () => {
    const mockImage = 'image-data';
    const mockError = new Error('Processing failed');

    global.fetch = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useImageProcessing());

    await expect(result.current.processImage(mockImage)).rejects.toThrow(mockError);

    expect(result.current.processedImage).toBeNull();
    expect(result.current.progress).toBe(20);
    expect(mockSetImageUrl).not.toHaveBeenCalled();
  });
});
