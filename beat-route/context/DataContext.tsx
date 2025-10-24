
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

// --- 1. Define the shapes of your data ---
export interface Profile {
  username: string;
  bio: string;
  website: string;
}

export interface Post {
  id: number;
  text: string;
  createdAt: Date;
}

interface DataContextType {
  profile: Profile | null;
  posts: Post[];
  addPost: (text: string) => void;
  loading: boolean;
}

// --- 2. Create the Context ---
const DataContext = createContext<DataContextType | undefined>(undefined);

// --- 3. Create the Provider with Mock Data and Logic ---
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // Get the current user

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // This effect simulates fetching data when the user logs in
  useEffect(() => {
    if (user) {
      setLoading(true);
      // Simulate a network call to fetch data
      setTimeout(() => {
        // Mock profile data for the logged-in user
        setProfile({
          username: 'beat-route-user',
          bio: 'Building a new app with a solid plan!',
          website: 'https://example.com',
        });
        // Mock posts data
        setPosts([
          { id: 1, text: 'This is my first post on the new app!', createdAt: new Date() },
          { id: 2, text: 'Using mock data is making development so much faster.', createdAt: new Date() },
        ]);
        setLoading(false);
      }, 1200);
    } else {
      // If user logs out, clear the data
      setProfile(null);
      setPosts([]);
    }
  }, [user]); // This effect re-runs whenever the user object changes

  const addPost = (text: string) => {
    const newPost: Post = {
      id: Math.random(), // Not a great ID, but fine for mock data
      text,
      createdAt: new Date(),
    };
    setPosts(currentPosts => [newPost, ...currentPosts]);
  };

  return (
    <DataContext.Provider value={{ profile, posts, addPost, loading }}>
      {children}
    </DataContext.Provider>
  );
};

// --- 4. Create the custom hook ---
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
