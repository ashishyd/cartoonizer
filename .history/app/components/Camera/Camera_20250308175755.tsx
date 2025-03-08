'use client';

import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { FaceDetection, detectFaces } from '../../lib/faceDetection';
import useSound from 'use-sound';

export function Camera({ onCapture }: { onCapture: (img: string) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [faces, setFaces] = useState<FaceDetection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playShutter] = useSound('/sounds/camera-shutter.mp3');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const video = webcamRef.current?.video;

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1280, height: 720 },
        });
        if (webcamRef.current) webcamRef.current.video.srcObject = stream;
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    const faceDetectionLoop = async () => {
      if (!video) return;
      const detections = await detectFaces(video);
      setFaces(detections);
      if (detections.length > 0) autoCapture(detections);
    };

    const autoCapture = (detections: FaceDetection[]) => {
      const mainFace = detections[0];
      const isCentered = checkFacePosition(mainFace, video);
      if (isCentered && countdown === 0) startCountdown();
    };

    initCamera();
    const detectionInterval = setInterval(faceDetectionLoop, 500);

    return () => {
      clearInterval(detectionInterval);
      if (interval) clearInterval(interval);
    };
  }, []);

  const checkFacePosition = (face: FaceDetection, video: HTMLVideoElement) => {
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const faceX = face.box.x + face.box.width / 2;
    const faceY = face.box.y + face.box.height / 2;
    return (
      Math.abs(faceX - videoWidth / 2) < videoWidth * 0.1 &&
      Math.abs(faceY - videoHeight / 2) < videoHeight * 0.1
    );
  };

  const startCountdown = () => {
    let counter = 3;
    setCountdown(counter);
    const interval = setInterval(() => {
      counter--;
      setCountdown(counter);
      if (counter === 0) {
        clearInterval(interval);
        capturePhoto();
      }
    }, 1000);
  };

  const capturePhoto = async () => {
    setIsProcessing(true);
    playShutter();
    const imageSrc = webcamRef.current?.getScreenshot({
      width: 1280,
      height: 720,
    });
    if (imageSrc) onCapture(imageSrc);
    setIsProcessing(false);
    setCountdown(0);
  };

  return (
    <div className="relative h-screen w-full bg-black">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="h-full w-full object-cover"
      />

      {/* Face Detection Overlay */}
      {faces.map((face, index) => (
        <div
          key={index}
          className="absolute border-2 border-green-400 rounded-lg transition-all"
          style={{
            left: `${(face.box.x / face.videoWidth) * 100}%`,
            top: `${(face.box.y / face.videoHeight) * 100}%`,
            width: `${(face.box.width / face.videoWidth) * 100}%`,
            height: `${(face.box.height / face.videoHeight) * 100}%`,
          }}
        />
      ))}

      {/* Countdown Overlay */}
      {countdown > 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-9xl font-bold text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {countdown}
        </motion.div>
      )}

      {/* Capture Feedback */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/50 animate-pulse" />
      )}
    </div>
  );
}
