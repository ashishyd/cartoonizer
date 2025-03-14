import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { useErrorStore } from '@/store/errorStore';
import { AppLogger } from '@/lib/logger';

export function useFaceDetection(videoElement: HTMLVideoElement | null | undefined) {
  const [faces, setFaces] = useState<faceapi.FaceDetection[]>([]);
  const { showError } = useErrorStore();

  useEffect(() => {
    if (!videoElement) {
      console.log('Video element is null or undefined');
      return;
    }

    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      } catch (error) {
        if (error instanceof Error) {
          showError({
            code: 'face-detection/model-load-error',
            message: 'Error loading face detection models.',
            context: { stack: error.stack },
          });
          AppLogger.logError({
            code: 'face-detection/model-load-error',
            message: error.message,
            context: { stack: error.stack },
            timestamp: new Date(),
          });
        }
      }
    };

    const detect = async () => {
      try {
        const detections = await faceapi.detectAllFaces(
          videoElement,
          new faceapi.TinyFaceDetectorOptions()
        );
        setFaces(detections);
      } catch (error) {
        if (error instanceof Error) {
          showError({
            code: 'face-detection/detection-error',
            message: 'Error detecting faces.',
            context: { stack: error.stack },
          });
          AppLogger.logError({
            code: 'face-detection/detection-error',
            message: error.message,
            context: { stack: error.stack },
            timestamp: new Date(),
          });
        }
      }
    };

    loadModels();
    const interval = setInterval(detect, 500);

    return () => clearInterval(interval);
  }, [videoElement, showError]);

  return { faces };
}
