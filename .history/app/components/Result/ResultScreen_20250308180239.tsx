'use client';

import { motion } from 'framer-motion';
import {Q} from 'qrcode.react';

export function ResultScreen({
  imageUrl,
  onRetry,
}: {
  imageUrl: string;
  onRetry: () => void;
}) {
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
          onClick={onRetry}
          className="px-6 py-3 border-2 border-white/40 text-white rounded-full"
        >
          Retake Photo
        </button>
      </div>

      <div className="absolute bottom-8 space-y-4">
        <div className="bg-white p-3 rounded-lg">
          <QRCode value={imageUrl} size={128} />
        </div>
        <p className="text-white/60 text-center text-sm">
          Scan to download your photo
        </p>
      </div>
    </div>
  );
}
