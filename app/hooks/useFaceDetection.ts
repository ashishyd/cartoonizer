import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export function useFaceDetection(videoElement: HTMLVideoElement | null | undefined) {
  const [faces, setFaces] = useState<faceapi.FaceDetection[]>([]);

  useEffect(() => {
    if (!videoElement) return;

    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    };

    const detect = async () => {
      const detections = await faceapi.detectAllFaces(
        videoElement,
        new faceapi.TinyFaceDetectorOptions()
      );
      setFaces(detections);
    };

    loadModels();
    const interval = setInterval(detect, 500);

    return () => clearInterval(interval);
  }, [videoElement]);

  return { faces };
}
