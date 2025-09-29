"use client";

import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const ChatBubbleColorPicker = () => {
  const { user, updateUserProfile } = useAuth();
  const [chatBubbleColor, setChatBubbleColor] = useState(user?.profileCustomization.chatBubbleColor || '');

  useEffect(() => {
    if (user?.profileCustomization.chatBubbleColor) {
      setChatBubbleColor(user.profileCustomization.chatBubbleColor);
    }
  }, [user]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setChatBubbleColor(newColor);

    if (user && updateUserProfile) {
      updateUserProfile({
        ...user,
        profileCustomization: {
          ...user.profileCustomization,
          chatBubbleColor: newColor,
        },
      });
    }
  };

  return (
    <Form.Group controlId="chatBubbleColorPicker" className="d-flex align-items-center ms-2">
      <Form.Label className="me-2 mb-0">Chat Bubble Color:</Form.Label>
      <Form.Control
        type="color"
        value={chatBubbleColor}
        onChange={handleColorChange}
        title="Choose your chat bubble color"
        style={{ width: '50px', height: '30px', padding: '0', border: 'none' }}
      />
    </Form.Group>
  );
};

export default ChatBubbleColorPicker;