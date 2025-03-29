'use client';

import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
  userImageUrl: string;
  setUserImageUrl: (url: string) => void;
  isAuthenticated: boolean;
  clearUser: () => void;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  userName: '',
  setUserName: () => {},
  userImageUrl: '',
  setUserImageUrl: () => {},
  isAuthenticated: false,
  clearUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string>('');
  const [userImageUrl, setUserImageUrlState] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated
  const isAuthenticated = userName.trim().length > 0;

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Set user name
  const setUserName = (name: string) => {
    setUserNameState(name);
  };

  // Set image URL
  const setUserImageUrl = (url: string) => {
    setUserImageUrlState(url);
  };

  // Clear user data
  const clearUser = () => {
    setUserNameState('');
    setUserImageUrlState('');
  };

  // Protect routes that require authentication
  useEffect(() => {
    const protectedRoutes = ['/camera', 'processing', '/crop'];

    if (protectedRoutes.includes(pathname) && !isAuthenticated) {
      router.push('/');
    }
  }, [pathname, isAuthenticated, router]);

  const value = {
    userName,
    setUserName,
    userImageUrl,
    setUserImageUrl,
    isAuthenticated,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  return context;
}
