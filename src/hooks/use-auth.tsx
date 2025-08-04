
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// This is a MOCK authentication system.
// The Firebase logic has been removed due to a persistent and unresolvable
// configuration error in this specific environment. This mock system allows
// the rest of the application to be used and developed.

const mockUsers: {[key: string]: AppUser} = {
    'admin@labtrack.com': {
        uid: 'mock-admin-uid',
        name: 'Admin User',
        email: 'admin@labtrack.com',
        role: 'Admin',
        avatar: 'https://placehold.co/40x40.png',
    },
    'tech@labtrack.com': {
        uid: 'mock-tech-uid',
        name: 'Tech User',
        email: 'tech@labtrack.com',
        role: 'Technician',
        avatar: 'https://placehold.co/40x40.png',
    },
     'researcher@labtrack.com': {
        uid: 'mock-researcher-uid',
        name: 'Researcher User',
        email: 'researcher@labtrack.com',
        role: 'Researcher',
        avatar: 'https://placehold.co/40x40.png',
    }
};

interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: 'Admin' | 'Technician' | 'Researcher';
  avatar: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

const FAKE_AUTH_STATE = 'labtrack_fake_auth_email';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for a "logged in" user
    try {
      const loggedInEmail = localStorage.getItem(FAKE_AUTH_STATE);
      if (loggedInEmail && mockUsers[loggedInEmail]) {
        setUser(mockUsers[loggedInEmail]);
      }
    } catch (error) {
      // Local storage might not be available
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    // This is a mock login. It does not check the password.
    if (mockUsers[email]) {
      const userToLogin = mockUsers[email];
      setUser(userToLogin);
      try {
        localStorage.setItem(FAKE_AUTH_STATE, email);
      } catch (error) {
        // Local storage not available
      }
    } else {
      throw new Error("Invalid email or password.");
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      localStorage.removeItem(FAKE_AUTH_STATE);
    } catch (error) {
      // Local storage not available
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
