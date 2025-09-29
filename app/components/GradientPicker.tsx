"use client";

import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const GradientPicker = () => {
  const { user, updateUserProfile } = useAuth();
  const [gradient, setGradient] = useState({
    color1: '#36393f',
    color2: '#2f3136',
    angle: 90,
  });

  useEffect(() => {
    const savedGradient = user?.profileCustomization?.profileGradient;
    if (savedGradient) {
      // Basic parsing, assumes format "linear-gradient(angle, color1, color2)"
      try {
        const parts = savedGradient.replace('linear-gradient(', '').replace(')', '').split(', ');
        const angle = parseInt(parts[0]);
        const color1 = parts[1];
        const color2 = parts[2];
        setGradient({ color1, color2, angle });
      } catch (e) {
        console.error("Could not parse saved gradient", e);
      }
    }
  }, [user]);

  const handleGradientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newGradient = { ...gradient, [name]: name === 'angle' ? parseInt(value) : value };
    setGradient(newGradient);

    const gradientString = `linear-gradient(${newGradient.angle}deg, ${newGradient.color1}, ${newGradient.color2})`;
    document.documentElement.style.setProperty('--background-gradient', gradientString);
    // Also set the main background to the gradient
    document.body.style.backgroundImage = gradientString;

    if (user && updateUserProfile) {
      updateUserProfile({
        ...user,
        profileCustomization: {
          ...user.profileCustomization,
          profileGradient: gradientString,
        },
      });
    }
  };

  return (
    <div className="d-flex align-items-center">
      <Form.Label className="me-2 mb-0">Background Gradient:</Form.Label>
      <Form.Control
        type="color"
        name="color1"
        value={gradient.color1}
        onChange={handleGradientChange}
        title="Choose start color"
        style={{ width: '50px', height: '30px', padding: '0', border: 'none' }}
      />
      <Form.Control
        type="color"
        name="color2"
        value={gradient.color2}
        onChange={handleGradientChange}
        title="Choose end color"
        style={{ width: '50px', height: '30px', padding: '0', border: 'none' }}
      />
      <Form.Range
        name="angle"
        min="0"
        max="360"
        value={gradient.angle}
        onChange={handleGradientChange}
        style={{ flexGrow: 1, marginLeft: '10px' }}
      />
    </div>
  );
};

export default GradientPicker;
