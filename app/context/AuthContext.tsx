"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of a saved game
interface SavedGame {
  id: string;
  name: string;
  timestamp: string;
  data: any; // This will hold the actual game state
}

// Define the shape of user profile customization
interface ProfileCustomization {
  textColor: string;
  backgroundColor: string; // Added background color
  // Add font, background, etc. later
}

// Define the shape of the User
interface User {
  id: string;
  username: string;
  password?: string; // Password is not exposed after login
  status: string;
  profilePictureUrl: string; // Added profile picture URL
  savedGames: SavedGame[];
  profileCustomization: ProfileCustomization;
}

// Define the shape of the context data
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateUserProfile: (updatedUser: User) => void; // New function to update profile
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded user data (for initial login, actual profile data will be loaded/saved)
const initialUsers: { id: string; username: string; password: string }[] = [
  { id: '1', username: 'ringthebell02', password: 'Gage@0424' },
  { id: '2', username: 'Moogietheboogie', password: 'Yippiebugz@666' },
];

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Function to get a default user profile
  const getDefaultUserProfile = (id: string, username: string): User => ({
    id,
    username,
    status: 'Hello, I am new here!',
    profilePictureUrl: 'https://via.placeholder.com/150', // Default profile picture
    savedGames: [],
    profileCustomization: {
      textColor: '#212529', // Default light mode text color
      backgroundColor: '#ffffff', // Default light mode background color
    },
  });

  // Load user profile from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user profile to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = (username: string, password: string): boolean => {
    const foundInitialUser = initialUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundInitialUser) {
      // Try to load existing profile from localStorage
      const storedProfile = localStorage.getItem(`userProfile_${foundInitialUser.id}`);
      if (storedProfile) {
        setUser(JSON.parse(storedProfile));
      } else {
        // Create a new default profile if not found
        const newUserProfile = getDefaultUserProfile(foundInitialUser.id, foundInitialUser.username);
        setUser(newUserProfile);
        localStorage.setItem(`userProfile_${foundInitialUser.id}`, JSON.stringify(newUserProfile));
      }
      return true;
    }
    setUser(null);
    return false;
  };

  const logout = () => {
    if (user) {
      // Save current user's profile before logging out
      localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(user));
    }
    setUser(null);
  };

  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(`userProfile_${updatedUser.id}`, JSON.stringify(updatedUser));
  };

  const isAuthenticated = user !== null; // Correctly placed

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};