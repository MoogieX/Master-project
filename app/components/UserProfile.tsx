"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Form, Button, ListGroup } from 'react-bootstrap';
import TextColorPicker from './TextColorPicker'; // Assuming this is the correct path
import BackgroundColorPicker from './BackgroundColorPicker'; // Import BackgroundColorPicker
import ThemeToggle from './ThemeToggle'; // Import ThemeToggle

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [status, setStatus] = useState(user?.status || '');
  const [editingStatus, setEditingStatus] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || '');
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);

  useEffect(() => {
    if (user) {
      setStatus(user.status);
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
            <img
              src={user.profilePictureUrl}
              alt="Profile"
              className="rounded-circle"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            {editingProfilePicture ? (
              <Form.Group className="mt-3">
                <Form.Control
                  type="text"
                  value={profilePictureUrl}
                  onChange={(e) => setProfilePictureUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
                <Button variant="success" size="sm" className="mt-2 me-2" onClick={() => {
                  if (user && updateUserProfile) {
                    updateUserProfile({ ...user, profilePictureUrl });
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