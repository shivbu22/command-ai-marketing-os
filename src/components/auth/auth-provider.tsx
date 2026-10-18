'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  onAuthStateChanged, 
  User,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
      const mockUser = {
        uid: 'mock-user-123',
        email: 'developer@pixalified.ai',
        displayName: 'Lead Architect',
        photoURL: 'https://github.com/nutlope.png',
        role: 'admin'
      };
      // Use setTimeout to avoid synchronous setState warning in effect
      const timer = setTimeout(() => {
        setUser(mockUser as unknown as User);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
      setUser(null);
      return;
    }
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    logout
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
