'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Camera, Palette, Wand2, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';

// Define the avatar emojis outside the component to prevent recreation on each render
const AVATAR_EMOJIS = ['🧙‍♂️', '🦸‍♀️', '🧚', '🦹‍♂️', '🧛‍♀️', '🧜‍♂️', '🧝‍♀️', '👾', '🤖', '👽'];

export default function BannerScreen() {
  const [animationIndex, setAnimationIndex] = useState(0);
  const { userName, isAuthenticated, userImageUrl } = useUser();
  const isInitialRender = useRef(true);

  const [avatarPositions, setAvatarPositions] = useState<
    Array<{
      emoji: string;
      x: number;
      y: number;
      delay: number;
      duration: number;
      direction: number;
    }>
  >([]);

  // Generate avatar positions only once on client-side initial render
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialRender.current) {
      isInitialRender.current = false;

      const newPositions = [...Array(15)].map(() => {
        const randomEmoji = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDelay = Math.random() * 10;
        const randomDuration = 15 + Math.random() * 25;
        const randomDirection = Math.floor(Math.random() * 4);

        return {
          emoji: randomEmoji,
          x: randomX,
          y: randomY,
          delay: randomDelay,
          duration: randomDuration,
          direction: randomDirection,
        };
      });

      setAvatarPositions(newPositions);
    }
  }, []);

  // Set up animation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationIndex((prev) => (prev + 1) % AVATAR_EMOJIS.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='w-full h-full flex flex-col justify-center items-center p-6 relative'>
      {/* Floating avatar emojis across the viewport */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {avatarPositions.map((position, i) => (
          <div
            key={i}
            className='absolute text-2xl opacity-30'
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              animation: `float-${position.direction} ${position.duration}s ease-in-out infinite`,
              animationDelay: `${position.delay}s`,
            }}
          >
            {position.emoji}
          </div>
        ))}
      </div>

      <Card className='w-full max-w-md bg-white/60 backdrop-blur-md border-0 shadow-xl'>
        <CardHeader className='pb-4'>
          <div className='flex justify-center mb-6 relative'>
            <div className='absolute -top-2 -left-2 w-8 h-8 bg-[#ffb6e1] rounded-full animate-ping opacity-75'></div>
            <div className='relative z-10 bg-gradient-to-br from-[#ffb6e1] to-[#d9c5ff] p-4 rounded-full shadow-lg'>
              {isAuthenticated ? (
                userImageUrl ? (
                  <div className='h-10 w-10 rounded-full overflow-hidden'>
                    <Image
                      src={userImageUrl || '/placeholder.svg'}
                      alt={userName}
                      className='h-full w-full object-cover'
                    />
                  </div>
                ) : (
                  <User className='h-10 w-10 text-white' />
                )
              ) : (
                <Wand2 className='h-10 w-10 text-white' />
              )}
            </div>
            <div
              className='absolute -bottom-2 -right-2 w-8 h-8 bg-[#c5f8ff] rounded-full animate-ping opacity-75'
              style={{ animationDelay: '0.5s' }}
            ></div>
          </div>

          <CardTitle className='text-center text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff6eb1] via-[#ff9e7d] to-[#7d95ff]'>
            Cartoonizer
          </CardTitle>

          {isAuthenticated ? (
            <div className='animate-fade-in'>
              <div className='flex justify-center mt-4 mb-2'>
                <span className='text-2xl font-bold text-gray-800'>Hey, {userName}! 👋</span>
              </div>
              {userImageUrl && (
                <div className='mt-4 flex justify-center'>
                  <div className='w-32 h-32 rounded-lg overflow-hidden border-4 border-[#ffb6e1]/30 shadow-lg'>
                    <img
                      src={userImageUrl || '/placeholder.svg'}
                      alt={`${userName}'s photo`}
                      className='w-full h-full object-cover'
                    />
                  </div>
                </div>
              )}
              <CardDescription className='text-center mt-4 text-lg text-gray-700'>
                {userImageUrl
                  ? 'Looking good! Your cartoon is being created...'
                  : 'Ready to transform into your cartoon alter-ego?'}
              </CardDescription>
            </div>
          ) : (
            <>
              <div className='flex justify-center mt-2 space-x-1'>
                <span className='text-xl'>Transform yourself into</span>
                <span className='text-xl font-bold text-[#7d95ff] inline-block min-w-[1.5em] text-center'>
                  {AVATAR_EMOJIS[animationIndex]}
                </span>
              </div>
              <CardDescription className='text-center mt-4 text-lg text-gray-700'>
                Strike a pose and become a cartoon masterpiece in seconds!
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent>
          <div className='space-y-6'>
            {isAuthenticated ? (
              userImageUrl ? (
                <>
                  <div className='flex items-center space-x-3 bg-white/40 p-3 rounded-lg'>
                    <Sparkles className='h-5 w-5 text-[#ffb342] flex-shrink-0' />
                    <p className='text-gray-700'>Your photo has been captured successfully!</p>
                  </div>
                  <div className='flex items-center space-x-3 bg-white/40 p-3 rounded-lg'>
                    <Palette className='h-5 w-5 text-[#7dc9ff] flex-shrink-0' />
                    <p className='text-gray-700'>
                      Our AI is working on your cartoon transformation
                    </p>
                  </div>
                  <div className='p-4 bg-[#ffd1c2]/30 rounded-lg border border-[#ff6eb1]/20'>
                    <p className='text-center font-medium text-gray-800'>
                      {userName}, your cartoon avatar will be ready soon!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className='flex items-center space-x-3 bg-white/40 p-3 rounded-lg'>
                    <Camera className='h-5 w-5 text-[#ff6eb1] flex-shrink-0' />
                    <p className='text-gray-700'>
                      Your cartoon adventure awaits! Head to the camera to get started.
                    </p>
                  </div>
                  <div className='flex items-center space-x-3 bg-white/40 p-3 rounded-lg'>
                    <Sparkles className='h-5 w-5 text-[#ffb342] flex-shrink-0' />
                    <p className='text-gray-700'>
                      We&apos;ve prepared some special cartoon styles just for you!
                    </p>
                  </div>
                  <div className='p-4 bg-[#ffd1c2]/30 rounded-lg border border-[#ff6eb1]/20'>
                    <p className='text-center font-medium text-gray-800'>
                      {userName}, your cartoon self is just a click away!
                    </p>
                  </div>
                </>
              )
            ) : (
              <>
                <div className='flex items-center space-x-3 bg-white/40 p-3 rounded-lg'>
                  <Camera className='h-5 w-5 text-[#ff6eb1] flex-shrink-0' />
                  <p className='text-gray-700'>Strike your most epic pose for the camera!</p>
                </div>
                <div className='flex items-center space-x-3 bg-white/40 p-3 rounded-lg'>
                  <Sparkles className='h-5 w-5 text-[#ffb342] flex-shrink-0' />
                  <p className='text-gray-700'>
                    Watch as our magic pixie dust transforms your face
                  </p>
                </div>
                <div className='flex items-center space-x-3 bg-white/40 p-3 rounded-lg'>
                  <Palette className='h-5 w-5 text-[#7dc9ff] flex-shrink-0' />
                  <p className='text-gray-700'>
                    Become a superhero, anime star, or fantasy character
                  </p>
                </div>
                <p className='text-center mt-6 italic text-sm text-gray-600 flex items-center justify-center'>
                  Ready for your cartoon close-up?
                  <span className='inline-flex items-center ml-1 font-medium text-[#ff6eb1]'>
                    Let&apos;s get snapping! <Camera className='h-4 w-4 ml-1' />
                  </span>
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
