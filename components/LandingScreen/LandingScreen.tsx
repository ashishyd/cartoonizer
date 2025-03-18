'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchEvent, fetchSocialPlatforms, useStore } from '@/store/store';
import { useErrorStore } from '@/store/errorStore';
import { ERROR_TYPES } from '@/types/error';
import { AppLogger } from '@/lib/logger';

export function LandingScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [socialHandles, setSocialHandles] = useState<UserSocial[]>();
  const { showError } = useErrorStore();
  // const hasProcessed = useRef(false);
  const { event, socialPlatforms, setUserDetails, setUserSocial } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName) {
      setUserDetails({ full_name: fullName, user_social: socialHandles || [] });
      router.push('/camera');
    }
  };

  const handleSocialHandleChange = (index: number, value: string, platformId: bigint) => {
    const newSocialHandles = !socialHandles ? new Array(1) : [...socialHandles];
    newSocialHandles[0].handle = value;
    newSocialHandles[0].platformId = platformId;
    setSocialHandles(newSocialHandles);
  };

  // const fetchFacts = async () => {
  //   try {
  //     const factsResponse = await fetch('/api/facts');
  //     const { facts } = await factsResponse.json();
  //     setEpamFacts(facts);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       showError({
  //         code: ERROR_TYPES.GENERAL.UNEXPECTED,
  //         message: 'Failed to load EPAM facts',
  //         context: { stack: error.stack },
  //       });
  //       AppLogger.logError({
  //         code: ERROR_TYPES.GENERAL.UNEXPECTED,
  //         message: error.message,
  //         context: { stack: error.stack },
  //         timestamp: new Date(),
  //       });
  //     }
  //   }
  // };

  useEffect(() => {
    // if (!hasProcessed.current) {
    //   hasProcessed.current = true;
    //   fetchFacts();
    // }
    // Fetch initial data when component mounts
    fetchEvent('Test Event').catch((error) => {
      showError({
        code: ERROR_TYPES.GENERAL.UNEXPECTED,
        message: 'Failed to fetch event data',
        context: { stack: error.stack },
      });
      AppLogger.logError({
        code: ERROR_TYPES.GENERAL.UNEXPECTED,
        message: error.message,
        context: { stack: error.stack },
        timestamp: new Date(),
      });
    });
    fetchSocialPlatforms().catch((error) => {
      showError({
        code: ERROR_TYPES.GENERAL.UNEXPECTED,
        message: 'Failed to social platforms data',
        context: { stack: error.stack },
      });
      AppLogger.logError({
        code: ERROR_TYPES.GENERAL.UNEXPECTED,
        message: error.message,
        context: { stack: error.stack },
        timestamp: new Date(),
      });
    });
  }, []);

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6'
      >
        <h1 className='text-3xl font-bold text-center text-gray-800'>{event.name}</h1>
        <h3 className='text-sm font-italics text-center text-gray-800'>{event.description}</h3>

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

          {socialPlatforms.map((socialPlatform, index) => (
            <div key={index} className='space-y-4'>
              <div className='flex space-x-4'>
                <div className='flex-1'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {socialPlatform.name}
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      value={socialHandles && socialHandles[index].handle}
                      onChange={(e) =>
                        handleSocialHandleChange(
                          index,
                          e.target.value.replace('@', ''),
                          socialPlatform.id
                        )
                      }
                      className='w-full px-4 py-3 pl-8 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type='submit'
          disabled={!fullName}
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
