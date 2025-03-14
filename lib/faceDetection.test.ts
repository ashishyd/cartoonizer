import { detectFaces } from './faceDetection';
import * as faceapi from 'face-api.js';

jest.mock('face-api.js', () => ({
  nets: {
    tinyFaceDetector: {
      loadFromUri: jest.fn().mockResolvedValue(undefined),
    },
  },
  detectAllFaces: jest.fn(),
  TinyFaceDetectorOptions: jest.fn(),
}));

describe('detectFaces', () => {
  it('detects faces and returns correct structure', async () => {
    const video = { videoWidth: 640, videoHeight: 480 } as HTMLVideoElement;
    (faceapi.detectAllFaces as jest.Mock).mockResolvedValueOnce([
      { box: { x: 10, y: 20, width: 100, height: 200 } },
    ]);

    const result = await detectFaces(video);

    expect(result).toEqual([
      {
        box: { x: 10, y: 20, width: 100, height: 200 },
        videoWidth: 640,
        videoHeight: 480,
      },
    ]);
  });

  it('returns empty array when no faces are detected', async () => {
    const video = { videoWidth: 640, videoHeight: 480 } as HTMLVideoElement;
    (faceapi.detectAllFaces as jest.Mock).mockResolvedValueOnce([]);

    const result = await detectFaces(video);

    expect(result).toEqual([]);
  });

  it('throws error when face detection fails', async () => {
    const video = { videoWidth: 640, videoHeight: 480 } as HTMLVideoElement;
    (faceapi.detectAllFaces as jest.Mock).mockRejectedValueOnce(new Error('Detection failed'));

    await expect(detectFaces(video)).rejects.toThrow('Detection failed');
  });
});
