"use client";

import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const BackgroundColorPicker = () => {
  const { user, updateUserProfile } = useAuth();
  const [backgroundColor, setBackgroundColor] = useState(user?.profileCustomization.backgroundColor || '');

  useEffect(() => {
    if (user?.profileCustomization.backgroundColor) {
      setBackgroundColor(user.profileCustomization.backgroundColor);
      document.documentElement.style.setProperty('--background-color', user.profileCustomization.backgroundColor);
    } else {
      // Set a default if nothing is saved in user profile
      document.documentElement.style.setProperty('--background-color', '#ffffff'); // Default light mode background color
    }
  }, [user]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBackgroundColor(newColor);
    document.documentElement.style.setProperty('--background-color', newColor);

    if (user && updateUserProfile) {
      updateUserProfile({
        ...user,
        profileCustomization: {
          ...user.profileCustomization,
          backgroundColor: newColor,
        },
      });
    }
  };

  return (
    <Form.Group controlId="backgroundColorPicker" className="d-flex align-items-center ms-2">
      <Form.Label className="me-2 mb-0">Background Color:</Form.Label>
      <Form.Control
        type="color"
        value={backgroundColor}
        onChange={handleColorChange}
        title="Choose your background color"
        style={{ width: '50px', height: '30px', padding: '0', border: 'none' }}
      />
    </Form.Group>
  );
};

export default BackgroundColorPicker;