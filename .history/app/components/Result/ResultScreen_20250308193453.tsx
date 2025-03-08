'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

export function ResultScreen({
  imageUrl,
  onRetry,
}: {
  imageUrl: string;
  onRetry: () => void;
}) {
  const [showQRCode, setShowQRCode] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qrError, setQrError] = useState('');

  useEffect(() => {
    if (showQRCode && !shortUrl) {
      generateShortUrl();
    }
  }, [showQRCode]);

  const generateShortUrl = async () => {
    try {
      setIsLoading(true);
      setQrError('');

      const response = await fetch('/api/shorten-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!response.ok) throw new Error('Failed to generate short URL');

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (error) {
      console.error('URL shortening failed:', error);
      setQrError('Failed to generate QR code. The image URL is too long.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col items-center justify-center gap-8 p-4">
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        src={imageUrl}
        alt="Result"
        className="w-full max-w-2xl rounded-2xl shadow-xl border-4 border-white/10"
      />

      <div className="flex gap-4">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-white/90 text-black rounded-full font-semibold"
        >
          Print Now
        </button>
        <button
          onClick={() => setShowQRCode(!showQRCode)}
          className="px-6 py-3 border-2 border-white/40 text-white rounded-full"
        >
          {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
        </button>
        <button
          onClick={onRetry}
          className="px-6 py-3 border-2 border-white/40 text-white rounded-full"
        >
          Retake Photo
        </button>
      </div>

      {showQRCode && (
        <div className="absolute bottom-8 space-y-4">
          {isLoading ? (
            <div className="text-white/60">Generating QR code...</div>
          ) : qrError ? (
            <div className="text-red-400 max-w-xs text-center">{qrError}</div>
          ) : (
            <>
              <div className="bg-white p-3 rounded-lg">
                <QRCodeSVG
                  value={shortUrl || imageUrl}
                  size={128}
                  level="H" // Higher error correction
                />
              </div>
              <p className="text-white/60 text-center text-sm">
                Scan to download your photo
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
