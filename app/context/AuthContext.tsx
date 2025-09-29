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

import { ObjectId } from 'mongodb'; // Import ObjectId

// Define the shape of the User
interface User {
  _id: ObjectId; // MongoDB's default ID type
  username: string;
  status: string;
  profilePictureUrl: string;
  savedGames: SavedGame[];
  profileCustomization: ProfileCustomization;
}

// Define the shape of the context data
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>; // Updated to return Promise<boolean>
  logout: () => void;
  updateUserProfile: (updatedUser: User) => Promise<void>; // Updated to return Promise<void>
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
    _id: new ObjectId(id), // Use ObjectId for MongoDB
    username,
    status: 'Hello, I am new here!',
    profilePictureUrl: 'https://via.placeholder.com/150', // Default profile picture
    savedGames: [],
    profileCustomization: {
      textColor: '#212529', // Default light mode text color
      backgroundColor: '#ffffff', // Default light mode background color
    },
  });

  // Load user profile from MongoDB on initial render or login
  useEffect(() => {
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      fetch(`/api/users?userId=${storedUserId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.message) { // Check if data is valid and not an error message
            setUser({ ...data, _id: new ObjectId(data._id) }); // Re-hydrate ObjectId
          } else {
            localStorage.removeItem('currentUserId'); // Clear invalid user
          }
        })
        .catch(error => {
          console.error('Failed to fetch user profile on initial load:', error);
          localStorage.removeItem('currentUserId');
        });
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundInitialUser = initialUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundInitialUser) {
      // Check if user profile exists in MongoDB
      try {
        const res = await fetch(`/api/users?userId=${foundInitialUser.id}`);
        let userProfile = await res.json();

        if (res.status === 404) { // User not found in DB, create a new one
          const newUserProfile = getDefaultUserProfile(foundInitialUser.id, foundInitialUser.username);
          // Insert new user into MongoDB (this would require a POST API route, for now we'll simulate)
          // For simplicity, we'll just set it locally and assume it will be created on first update
          setUser(newUserProfile);
          localStorage.setItem('currentUserId', newUserProfile._id.toHexString());
          return true;
        } else if (res.ok) {
          setUser({ ...userProfile, _id: new ObjectId(userProfile._id) }); // Re-hydrate ObjectId
          localStorage.setItem('currentUserId', userProfile._id);
          return true;
        }
      } catch (error) {
        console.error('Error during login fetching/creating profile:', error);
      }
    }
    setUser(null);
    localStorage.removeItem('currentUserId');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUserId');
  };

  const updateUserProfile = async (updatedUser: User) => {
    try {
      const res = await fetch(`/api/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: updatedUser._id.toHexString(), updatedProfile: updatedUser }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Profile updated in DB:', data);
        setUser(updatedUser); // Update local state after successful DB update
      } else {
        console.error('Failed to update profile in DB:', await res.json());
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const isAuthenticated = user !== null;

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