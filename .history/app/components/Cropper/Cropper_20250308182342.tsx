'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export function Cropper({
  imageSrc,
  onComplete,
}: {
  imageSrc: string;
  onComplete: (img: string) => Promise<void>;
}) {
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getCroppedImage = useCallback(async () => {
    const image = imgRef.current;
    if (!image || !crop?.width || !crop?.height) return;

    setIsProcessing(true);
    try {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const canvas = document.createElement('canvas');
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const croppedImage = canvas.toDataURL('image/jpeg');
      await onComplete(croppedImage);
    } catch (error) {
      console.error('Cropping failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [crop, onComplete]);

  return (
    <div className="relative h-screen w-full bg-gray-900 flex flex-col">
      <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        aspect={1}
        circularCrop
        className="flex-1"
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Edit"
          className="w-full h-full object-contain"
        />
      </ReactCrop>

      <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 text-gray-300 hover:text-white"
        >
          Retake
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {crop ? 'Adjust crop area' : 'Select area to crop'}
          </span>
          <button
            onClick={getCroppedImage}
            disabled={!crop || isProcessing}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">🌀</span>
                Processing...
              </span>
            ) : (
              'Apply Crop'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
