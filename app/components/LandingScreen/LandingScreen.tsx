'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store';

export function LandingScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const { setUserDetails } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && socialHandle) {
      setUserDetails({ fullName, socialHandle });
      router.push('/camera');
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6'
      >
        <h1 className='text-3xl font-bold text-center text-gray-800'>Photo Booth</h1>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
            <input
              type='text'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Social Media Handle
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>@</span>
              <input
                type='text'
                value={socialHandle}
                onChange={(e) => setSocialHandle(e.target.value.replace('@', ''))}
                className='w-full px-4 py-3 pl-8 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
                required
              />
            </div>
          </div>
        </div>

        <button
          type='submit'
          disabled={!fullName || !socialHandle}
          className='w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg
                   hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors duration-200'
        >
          Continue
        </button>
      </form>
    </div>
  );
}
