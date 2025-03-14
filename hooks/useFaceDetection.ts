import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export function useFaceDetection(videoElement: HTMLVideoElement | null | undefined) {
  const [faces, setFaces] = useState<faceapi.FaceDetection[]>([]);

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
        console.error('Error loading models:', error);
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
        console.error('Error detecting faces:', error);
      }
    };

    loadModels();
    const interval = setInterval(detect, 500);

    return () => clearInterval(interval);
  }, [videoElement]);

  return { faces };
}
