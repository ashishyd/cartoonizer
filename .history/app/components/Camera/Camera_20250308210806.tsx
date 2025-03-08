'use client';

import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { useFaceDetection } from '../hooks/useFaceDetection';

export default function Camera({ onCapture }: { onCapture: (img: string) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const { faces } = useFaceDetection(webcamRef.current?.video);

  const capture = async () => {
    setFlashEffect(true);
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
    setTimeout(() => setFlashEffect(false), 200);
  };

  useEffect(() => {
    const updateAspectRatio = () => {
      if (window.matchMedia('(orientation: portrait)').matches) {
        setAspectRatio(4 / 5);
      } else {
        setAspectRatio(16 / 9);
      }
    };
    
    updateAspectRatio();
    window.addEventListener('resize', updateAspectRatio);
    return () => window.removeEventListener('resize', updateAspectRatio);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      {/* Camera Preview Container */}
      <div className="w-full max-w-2xl relative rounded-xl overflow-hidden shadow-2xl bg-black">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ 
            facingMode: 'user',
            aspectRatio
          }}
          onUserMedia={() => setIsCameraReady(true)}
          className={`w-full h-full object-cover transition-opacity ${
            isCameraReady ? 'opacity-100' : 'opacity-0'
          } ${flashEffect ? 'animate-camera-flash' : ''}`}
        />

        {/* Face Detection Overlays */}
        {faces.map((face, index) => (
          <div
            key={index}
            className="absolute border-2 border-green-400 rounded-lg transition-all"
            style={{
              left: `${(face.box.x / face.videoWidth) * 100}%`,
              top: `${(face.box.y / face.videoHeight) * 100}%`,
              width: `${(face.box.width / face.videoWidth) * 100}%`,
              height: `${(face.box.height / face.videoHeight) * 100}%`
            }}
          />
        ))}

        {/* Viewfinder Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            viewBox="0 0 100 100"
            className="w-4/5 max-w-md text-white/80"
          >
            <path
              d="M13,2 L2,2 L2,13 M2,87 L2,98 L13,98 M87,98 L98,98 L98,87 M98,13 L98,2 L87,2"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </div>

      {/* Capture Controls */}
      <div className="mt-8 w-full max-w-md flex flex-col items-center gap-4">
        <motion.button
          onClick={capture}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="h-16 w-16 rounded-full bg-white/90 border-4 border-white shadow-xl
                    flex items-center justify-center relative"
        >
          <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
          <div className="h-8 w-8 rounded-full bg-blue-500 shadow-inner" />
        </motion.button>

        <p className="text-white/70 text-center text-sm px-4">
          Center your face within the frame and tap to capture
        </p>
      </div>

      {/* Error State */}
      {!isCameraReady && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
          <p className="text-white text-center">
            Camera access required. Please allow camera permissions
            <br />
            <span className="text-sm text-white/60">
              (Make sure your camera is connected and enabled)
            </span>
          </p>
        </div>
      )}
    </div>
  );
}