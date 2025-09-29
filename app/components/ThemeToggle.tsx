"use client";

import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Default to dark mode

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) { // If a theme is saved, use it
      setTheme(savedTheme as 'light' | 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else { // Otherwise, default to dark mode
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark'); // Save dark mode as default
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Button variant="secondary" onClick={toggleTheme} className="ms-2">
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </Button>
  );
};

export default ThemeToggle;