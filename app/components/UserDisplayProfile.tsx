"use client";

import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner, Button } from 'react-bootstrap'; // Import Button

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
    <Card style={{ border: 'none', backgroundColor: 'var(--background-secondary)' }}>
      {/* Profile Banner */}
      <div style={{
        height: '120px',
        backgroundColor: 'var(--background-accent)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: userProfile.profileBannerUrl ? `url(${userProfile.profileBannerUrl})` : 'none'
      }}></div>

      <Card.Body style={{ paddingTop: '60px', position: 'relative' }}>
        {/* Profile Picture */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '20px',
          border: '4px solid var(--background-secondary)',
          borderRadius: '50%',
          width: '120px',
          height: '120px'
        }}>
          <img
            src={userProfile.profilePictureUrl || '/default-avatar.png'}
            alt="Profile"
            className="rounded-circle"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <Card.Title as="h4" style={{ marginTop: '15px', fontWeight: '600' }}>{userProfile.username}</Card.Title>
        <hr style={{ borderColor: 'var(--background-accent)' }} />
        <Card.Text><strong>Status:</strong> {userProfile.status}</Card.Text>
        <Card.Text><strong>School:</strong> {userProfile.school}</Card.Text>
        <Button variant="secondary" onClick={onClose} className="mt-3">Close</Button>
      </Card.Body>
    </Card>
  );
};

export default UserDisplayProfile;