
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our user object, similar to a Supabase user
interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  isLoading: boolean;
}

// Create the authentication context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock user object that mimics a real Supabase user
const MOCK_USER: User = {
  id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  email: 'mock.user@example.com',
  user_metadata: {
    full_name: 'Beat Route User',
    avatar_url: 'https://place-hold.it/150',
  },
};

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [isLoading, setIsLoading] = useState(false);

  // Mock sign-in function
  const signIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(MOCK_USER);
      setIsLoading(false);
    }, 1000); // Simulate network delay
  };

  // Mock sign-out function
  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
