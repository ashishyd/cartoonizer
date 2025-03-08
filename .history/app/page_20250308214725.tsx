'use client';

import { useState } from 'react';
import { Camera } from './components/Camera/Camera';
import { Cropper } from './components/Cropper/Cropper';
import { ProcessingScreen } from './components/Processing/ProcessingScreen';
import { ResultScreen } from './components/Result/ResultScreen';
import { useImageProcessing } from './hooks/useImageProcessing';
import { ErrorBoundary } from './components/Error/ErrorBoundary';


export default function PhotoBoothPage() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<
    'camera' | 'crop' | 'processing' | 'result'
  >('camera');
  const { processedImage, progress, processImage } = useImageProcessing();

  const handleCapture = (image: string) => {
    setCurrentImage(image);
    setCurrentStep('crop');
  };

  const handleCropComplete = async (croppedImage: string) => {
    setCurrentStep('processing');
    try {
      await processImage(croppedImage);
      setCurrentStep('result');
    } catch (error) {
      // setCurrentStep('camera');
      console.log(error);
    }
  };

  return (
    <ErrorBoundary
    <main className="h-screen w-full bg-gray-900">
      {currentStep === 'camera' && <Camera onCapture={handleCapture} />}
      {currentStep === 'crop' && currentImage && (
        <Cropper imageSrc={currentImage} onComplete={handleCropComplete} />
      )}
      {currentStep === 'processing' && <ProcessingScreen progress={progress} />}
      {currentStep === 'result' && processedImage && (
        <ResultScreen
          imageUrl={processedImage}
          onRetry={() => setCurrentStep('camera')}
        />
      )}
    </main>
  );
}
