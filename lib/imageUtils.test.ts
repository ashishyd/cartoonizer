import { addLogo, optimizeImage } from './imageUtils';
import { loadImage } from 'canvas';

jest.mock('canvas', () => ({
  createCanvas: jest.fn().mockImplementation(() => ({
    width: 800,
    height: 600,
    toDataURL: jest.fn().mockReturnValue('data:image/jpeg;base64,test'),
    getContext: jest.fn().mockReturnValue({
      drawImage: jest.fn(),
    }),
  })),
  loadImage: jest.fn().mockResolvedValue({
    width: 800,
    height: 600,
    src: '',
    complete: true,
    naturalHeight: 600,
    naturalWidth: 800,
    onload: jest.fn(),
    onerror: jest.fn(),
  }),
}));

describe('imageUtils', () => {
  describe('addLogo', () => {
    it('adds logo and name to image', async () => {
      const result = await addLogo('base.jpg', 'logo.png', 'John Doe');
      expect(result).toMatch(/data:image\/jpeg;base64/);
    });

    it('adds logo, name, and social handle to image', async () => {
      const result = await addLogo('base.jpg', 'logo.png', 'John Doe', 'john_doe');
      expect(result).toMatch(/data:image\/jpeg;base64/);
    });

    it('throws error when base image fails to load', async () => {
      jest.mocked(loadImage).mockRejectedValueOnce(new Error('Failed to load base image'));
      await expect(addLogo('invalid.jpg', 'logo.png', 'John Doe')).rejects.toThrow(
        'Failed to add logo'
      );
    });

    it('throws error when logo image fails to load', async () => {
      jest.mocked(loadImage).mockRejectedValueOnce(new Error('Failed to load logo image'));
      await expect(addLogo('base.jpg', 'invalid_logo.png', 'John Doe')).rejects.toThrow(
        'Failed to add logo'
      );
    });
  });

  describe('optimizeImage', () => {
    it('optimizes image to specified dimensions', async () => {
      const result = await optimizeImage('large.jpg');
      expect(result).toMatch(/data:image\/jpeg;base64/);
    });

    it('throws error when image fails to load', async () => {
      jest.mocked(loadImage).mockRejectedValueOnce(new Error('Failed to load image'));
      await expect(optimizeImage('invalid.jpg')).rejects.toThrow('Failed to load image');
    });
  });
});
