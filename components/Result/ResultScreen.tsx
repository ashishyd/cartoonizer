'use client';

// import { useState } from 'react';
import { motion } from 'framer-motion';
// import { QRCodeSVG } from 'qrcode.react';
// import { LinkedinShareButton, LinkedinIcon } from 'react-share';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { useErrorStore } from '@/store/errorStore';
import { AppLogger } from '@/lib/logger';
import { useUser } from '@/contexts/UserContext';

export function ResultScreen() {
  // const [showShareOptions, setShowShareOptions] = useState(false);
  // const shareText = 'Check out my awesome photo! 📸';
  // const hashtags = ['EPAM', 'MyAISelfie'];
  const router = useRouter();
  const { imageUrl, reset } = useStore();
  const { showError } = useErrorStore();
  const { clearUser } = useUser();

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'photo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      if (err instanceof Error) {
        showError({
          code: 'result/download-error',
          message: 'Failed to download the photo. Please try again.',
          context: { stack: err.stack },
        });
        AppLogger.logError({
          code: 'result/download-error',
          message: err.message,
          context: { stack: err.stack },
          timestamp: new Date(),
        });
      }
    }
  };

  const handleStartOver = () => {
    try {
      reset();
      clearUser();
      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        showError({
          code: 'result/startover-error',
          message: 'Failed to start over. Please try again.',
          context: { stack: err.stack },
        });
        AppLogger.logError({
          code: 'result/startover-error',
          message: err.message,
          context: { stack: err.stack },
          timestamp: new Date(),
        });
      }
    }
  };

  return (
    <div className='h-screen w-full bg-gray-900 flex flex-col items-center justify-center gap-8 p-4'>
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        src={imageUrl}
        alt='Result'
        className='w-full max-w-2xl rounded-2xl shadow-xl border-4 border-white/10'
      />

      <div className='flex gap-4 flex-wrap justify-center'>
        <button
          onClick={() => window.print()}
          className='px-6 py-3 bg-white/90 text-black rounded-full font-semibold hover:bg-white transition-all'
        >
          Print
        </button>

        {/*<button*/}
        {/*  onClick={() => setShowShareOptions(!showShareOptions)}*/}
        {/*  className='px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all'*/}
        {/*>*/}
        {/*  {showShareOptions ? 'Hide Sharing' : 'Share Photo'}*/}
        {/*</button>*/}

        <button
          onClick={handleDownload}
          className='px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all'
        >
          Download
        </button>

        <button
          onClick={handleStartOver}
          className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
        >
          Start Over
        </button>
      </div>

      {/*{showShareOptions && (*/}
      {/*  <div className='flex gap-4 animate-fade-in'>*/}
      {/*    <LinkedinShareButton url={imageUrl} aria-label='Share on LinkedIn'>*/}
      {/*      <LinkedinIcon size={48} round className='hover:scale-110 transition-transform' />*/}
      {/*    </LinkedinShareButton>*/}
      {/*  </div>*/}
      {/*)}*/}

      {/*<div className='absolute bottom-8 space-y-4'>*/}
      {/*<div className='bg-white p-3 rounded-lg'>*/}
      {/*  <QRCodeSVG value={imageUrl} size={128} bgColor='#ffffff' fgColor='#000000' level='H' />*/}
      {/*</div>*/}
      {/*<p className='text-white/60 text-center text-sm'>Scan to download your photo</p>*/}

      {/*</div>*/}
    </div>
  );
}
