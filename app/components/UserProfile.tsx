"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Form, Button, ListGroup } from 'react-bootstrap';
import TextColorPicker from './TextColorPicker'; // Assuming this is the correct path

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [status, setStatus] = useState(user?.status || '');
  const [editingStatus, setEditingStatus] = useState(false);

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