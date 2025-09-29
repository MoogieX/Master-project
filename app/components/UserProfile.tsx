"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Form, Button, ListGroup } from 'react-bootstrap';
import TextColorPicker from './TextColorPicker'; // Assuming this is the correct path
import BackgroundColorPicker from './BackgroundColorPicker'; // Import BackgroundColorPicker
import ThemeToggle from './ThemeToggle'; // Import ThemeToggle

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [status, setStatus] = useState('');
  const [editingStatus, setEditingStatus] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);
  const [imageError, setImageError] = useState(false); // State to track image loading errors

  useEffect(() => {
    if (user) {
      setStatus(user.status);
      setProfilePictureUrl(user.profilePictureUrl);
    }
  }, [user]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const handleSaveStatus = () => {
    if (user && updateUserProfile) {
      updateUserProfile({ ...user, status });
      setEditingStatus(false);
    }
  };

  // Reset imageError when profilePictureUrl changes
  useEffect(() => {
    setImageError(false);
  }, [user?.profilePictureUrl]);

  const handleCancelEditStatus = () => {
    if (user) {
      setStatus(user.status);
    }
    setEditingStatus(false);
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h5">User Profile: {user.username}</Card.Header>
        <Card.Body>
          <div className="text-center mb-4">
            {/* Conditionally render image or placeholder */}
            {user.profilePictureUrl && !imageError ? (
              <img
                src={user.profilePictureUrl}
                alt="Profile"
                className="rounded-circle"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                onError={() => setImageError(true)} // Set error state on image load failure
              />
            ) : (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white"
                style={{ width: '150px', height: '150px', objectFit: 'cover', fontSize: '3rem' }}
              >
                ?
              </div>
            )}
            {editingProfilePicture ? (
              <Form.Group className="mt-3">
                <Form.Control
                  type="file" // Changed to file input
                  accept="image/*" // Accept only image files
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append('file', file);

                      try {
                        const uploadRes = await fetch('/api/upload-image', {
                          method: 'POST',
                          body: formData,
                        });

                        if (uploadRes.ok) {
                          const { imageUrl } = await uploadRes.json();
                          setProfilePictureUrl(imageUrl); // Update local state with Cloudinary URL
                        } else {
                          console.error('Image upload failed:', await uploadRes.json());
                          // Handle upload error (e.g., show a message to the user)
                        }
                      } catch (error) {
                        console.error('Error during image upload:', error);
                        // Handle network error
                      }
                    }
                  }}
                />
                <Button variant="success" size="sm" className="mt-2 me-2" onClick={() => {
                  if (user && updateUserProfile) {
                    updateUserProfile({ ...user, profilePictureUrl: profilePictureUrl });
                    setEditingProfilePicture(false);
                  }
                }}>Save</Button>
                <Button variant="secondary" size="sm" className="mt-2" onClick={() => {
                  if (user) {
                    setProfilePictureUrl(user.profilePictureUrl);
                  }
                  setEditingProfilePicture(false);
                }}>Cancel</Button>
              </Form.Group>
            ) : (
              <Button variant="primary" size="sm" className="mt-3" onClick={() => setEditingProfilePicture(true)}>Change Profile Picture</Button>
            )}
          </div>

          <Card.Title>Status:</Card.Title>
          {editingStatus ? (
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={status}
                onChange={handleStatusChange}
              />
              <Button variant="success" size="sm" className="mt-2 me-2" onClick={handleSaveStatus}>Save</Button>
              <Button variant="secondary" size="sm" className="mt-2" onClick={handleCancelEditStatus}>Cancel</Button>
            </Form.Group>
          ) : (
            <Card.Text>{user.status}</Card.Text>
          )}
          {!editingStatus && (
            <Button variant="primary" size="sm" onClick={() => setEditingStatus(true)}>Edit Status</Button>
          )}

          <hr />

          <Card.Title className="mt-4">Profile Customization:</Card.Title>
          <div className="d-flex align-items-center mb-3">
            <TextColorPicker />
          </div>
          <div className="d-flex align-items-center mb-3">
            <BackgroundColorPicker />
          </div>
          <div className="d-flex align-items-center mb-3">
            <ThemeToggle />
          </div>

          <hr />

          <Card.Title className="mt-4">Saved Games:</Card.Title>
          {user.savedGames.length > 0 ? (
            <ListGroup>
              {user.savedGames.map((game) => (
                <ListGroup.Item key={game.id}>
                  {game.name} - Saved on: {new Date(game.timestamp).toLocaleString()}
                  {/* Add a "Load Game" button here later */}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Card.Text>No saved games yet.</Card.Text>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile;