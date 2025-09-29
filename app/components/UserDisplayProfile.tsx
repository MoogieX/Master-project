"use client";

import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner } from 'react-bootstrap';

interface UserDisplayProfileProps {
  userId: string;
  onClose: () => void;
}

const UserDisplayProfile: React.FC<UserDisplayProfileProps> = ({ userId, onClose }) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/users?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data);
        } else {
          setError(`Failed to fetch user profile: ${res.statusText}`);
        }
      } catch (err) {
        setError('Error fetching user profile.');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <p className="text-danger">{error}</p>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container className="mt-5 text-center">
        <p>User profile not found.</p>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h5">Profile of {userProfile.username}</Card.Header>
        <Card.Body>
          <div className="text-center mb-4">
            <img
              src={userProfile.profilePictureUrl}
              alt="Profile"
              className="rounded-circle"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          </div>
          <Card.Text><strong>Status:</strong> {userProfile.status}</Card.Text>
          <Card.Text><strong>School:</strong> {userProfile.school}</Card.Text>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDisplayProfile;