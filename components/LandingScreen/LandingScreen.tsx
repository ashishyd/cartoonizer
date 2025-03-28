'use client';
import { useEffect, useState } from 'react';
import type React from 'react';

import { useRouter } from 'next/navigation';
import { UserCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

import { fetchEvent, fetchSocialPlatforms, useStore } from '@/store/store';
import { useErrorStore } from '@/store/errorStore';
import { ERROR_TYPES } from '@/types/error';
import type { UserSocial } from '@/types/userSocial';
import { AppLogger } from '@/lib/logger';

export default function LandingScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [socialHandles, setSocialHandles] = useState<UserSocial[]>();
  const { showError } = useErrorStore();
  // const hasProcessed = useRef(false);
  const { socialPlatforms, setUserDetails } = useStore();

  // Add UserContext integration
  const { setUserName } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName) {
      // Keep existing store update
      setUserDetails({ full_name: fullName, user_social: socialHandles || [] });

      // Add UserContext update
      setUserName(fullName);

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
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className='w-full max-w-md mx-auto bg-white/80 backdrop-blur-md border-0 shadow-xl'>
        <CardHeader>
          <div className='flex justify-center mb-4'>
            <UserCircle className='h-16 w-16 text-[#ff6eb1]' />
          </div>
          <CardTitle className='text-center text-2xl'>Welcome to Cartoonizer</CardTitle>
          <CardDescription className='text-center'>
            Please enter your name to start your cartoon adventure
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className='space-y-4 py-4'>
              <input
                type='text'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className='w-full px-4 py-3 rounded-lg border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
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
                        value={socialHandles && socialHandles[index]?.handle}
                        onChange={(e) =>
                          handleSocialHandleChange(
                            index,
                            e.target.value.replace('@', ''),
                            socialPlatform.id
                          )
                        }
                        className='w-full px-4 py-3 pl-8 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-red-800'
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <button
              type='submit'
              disabled={!fullName}
              className='w-full py-3 px-4 bg-gradient-to-r from-[#ea0f76] to-[#4765ec] text-white font-semibold rounded-lg
                    hover:opacity-100 cursor-auto disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200'
            >
              Let&apos;s Get Started!
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
