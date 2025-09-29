"use client";

import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const TextColorPicker = () => {
  const [textColor, setTextColor] = useState<string>('');

  useEffect(() => {
    const savedTextColor = localStorage.getItem('textColor');
    if (savedTextColor) {
      setTextColor(savedTextColor);
      document.documentElement.style.setProperty('--text-color', savedTextColor);
    } else {
      // Set a default if nothing is saved
      document.documentElement.style.setProperty('--text-color', '#212529'); // Default light mode text color
    }
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setTextColor(newColor);
    document.documentElement.style.setProperty('--text-color', newColor);
    localStorage.setItem('textColor', newColor);
  };

  return (
    <Form.Group controlId="textColorPicker" className="d-flex align-items-center ms-2">
      <Form.Label className="me-2 mb-0">Text Color:</Form.Label>
      <Form.Control
        type="color"
        value={textColor}
        onChange={handleColorChange}
        title="Choose your text color"
        style={{ width: '50px', height: '30px', padding: '0', border: 'none' }}
      />
    </Form.Group>
  );
};

export default TextColorPicker;