'use client';

import { useState, useEffect, useRef } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export function Cropper({ imageSrc, onComplete }: { imageSrc: string; onComplete: (img: string) => Promise<void> }) {
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!isProcessing) {
        setIsProcessing(true);
        const croppedImage = await getCroppedImage();
        if (croppedImage) {
          await onComplete(croppedImage);
        }
        setIsProcessing(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [crop]);

  const getCroppedImage = async () => {
    const image = imgRef.current;
    if (!image || !crop.width || !crop.height) return;

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

    return canvas.toDataURL('image/jpeg');
  };

  return (
    <div className="relative h-screen w-full bg-gray-900">
      <ReactCrop
        crop={crop}
        onChange={c => setCrop(c)}
        aspect={1}
        circularCrop
        className="max-h-[80vh]"
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Edit"
          className="w-full object-contain"
        />
      </ReactCrop>
      <div className="absolute bottom-8 left-0 right-0 text-center text-white/80 text-sm">
        {isProcessing ? 'Auto-processing...' : 'Adjust crop area - Changes save automatically'}
      </div>
    </div>
  );
}