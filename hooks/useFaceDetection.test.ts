import { renderHook } from '@testing-library/react-hooks';
import { useFaceDetection } from './useFaceDetection';
import * as faceapi from 'face-api.js';

jest.mock('face-api.js', () => ({
  nets: {
    tinyFaceDetector: {
      loadFromUri: jest.fn().mockResolvedValue(Promise.resolve()),
    },
    faceLandmark68Net: {
      loadFromUri: jest.fn().mockResolvedValue(Promise.resolve()),
    },
  },
  detectAllFaces: jest.fn().mockResolvedValue(Promise.resolve([])),
}));

describe('useFaceDetection', () => {
  let videoElement: HTMLVideoElement;

  beforeEach(() => {
    videoElement = document.createElement('video');
  });

  it('returns an empty array when videoElement is null', () => {
    const { result } = renderHook(() => useFaceDetection(null));
    expect(result.current.faces).toEqual([]);
  });

  it('loads models and sets faces when videoElement is provided', async () => {
    const detections = [{ detection: 'face1' }, { detection: 'face2' }];
    (faceapi.detectAllFaces as jest.Mock).mockResolvedValue(detections);

    const { result, waitForNextUpdate } = renderHook(() => useFaceDetection(videoElement));
    await waitForNextUpdate();

    expect(faceapi.nets.tinyFaceDetector.loadFromUri).toHaveBeenCalledWith('/models');
    expect(faceapi.nets.faceLandmark68Net.loadFromUri).toHaveBeenCalledWith('/models');
    expect(result.current.faces).toEqual(detections);
  });

  it('handles errors during model loading', async () => {
    (faceapi.nets.tinyFaceDetector.loadFromUri as jest.Mock).mockRejectedValue(
      new Error('Load error')
    );

    const { result, waitForNextUpdate } = renderHook(() => useFaceDetection(videoElement));
    await waitForNextUpdate();

    expect(result.current.faces).toEqual([]);
  });

  it('handles errors during face detection', async () => {
    (faceapi.detectAllFaces as jest.Mock).mockRejectedValue(new Error('Detection error'));

    const { result, waitForNextUpdate } = renderHook(() => useFaceDetection(videoElement));
    await waitForNextUpdate();

    expect(result.current.faces).toEqual([]);
  });
});
