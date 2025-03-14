import * as faceapi from 'face-api.js';

export type FaceDetection = {
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  videoWidth: number;
  videoHeight: number;
};

export async function detectFaces(video: HTMLVideoElement): Promise<FaceDetection[]> {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');

  const detections = await faceapi.detectAllFaces(
    video,
    new faceapi.TinyFaceDetectorOptions({
      inputSize: 512,
      scoreThreshold: 0.5,
    })
  );

  return detections.map((detection) => ({
    box: {
      x: detection.box.x,
      y: detection.box.y,
      width: detection.box.width,
      height: detection.box.height,
    },
    videoWidth: video.videoWidth,
    videoHeight: video.videoHeight,
  }));
}
