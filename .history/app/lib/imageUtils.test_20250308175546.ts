import { addLogo, optimizeImage } from './imageUtils';

jest.mock('canvas', () => ({
  createCanvas: jest.fn().mockImplementation(() => ({
    width: 800,
    height: 600,
    toDataURL: jest.fn().mockReturnValue('data:image/jpeg;base64,test'),
    getContext: jest.fn().mockReturnValue({
      drawImage: jest.fn(),
    })
  })),
  loadImage: jest.fn().mockResolvedValue({
    width: 800,
    height: 600,
    onload: jest.fn()
  })
}));

describe('imageUtils', () => {
  describe('addLogo', () => {
    it('adds logo to image', async () => {
      const result = await addLogo('base.jpg', 'logo.png');
      expect(result).toMatch(/data:image\/jpeg;base64/);
    });
  });

  describe('optimizeImage', () => {
    it('resizes and optimizes image', async () => {
      const result = await optimizeImage('large.jpg');
      expect(result).toMatch(/data:image\/jpeg;base64/);
    });
  });
});