"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Form, Button, ListGroup } from 'react-bootstrap';
import TextColorPicker from './TextColorPicker';
import BackgroundColorPicker from './BackgroundColorPicker';
import ThemeToggle from './ThemeToggle';
import ChatBubbleColorPicker from './ChatBubbleColorPicker';
import GradientPicker from './GradientPicker';

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [status, setStatus] = useState('');
  const [editingStatus, setEditingStatus] = useState(false);
  const [school, setSchool] = useState(user?.school || '');
  const [editingSchool, setEditingSchool] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || '');
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);
  const [profileBannerUrl, setProfileBannerUrl] = useState(user?.profileCustomization?.profileBannerUrl || '');
  const [editingProfileBanner, setEditingProfileBanner] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user) {
      setStatus(user.status);
      setProfilePictureUrl(user.profilePictureUrl);
      setProfileBannerUrl(user.profileCustomization?.profileBannerUrl || '');
    }
  }, [user]);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const uploadRes = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      if (uploadRes.ok) {
        const { imageUrl } = await uploadRes.json();
        return imageUrl;
      } else {
        console.error('Image upload failed:', await uploadRes.json());
        return null;
      }
    } catch (error) {
      console.error('Error during image upload:', error);
      return null;
    }
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <Container className="mt-5">
      <Card>
        <div style={{
          height: '160px',
          backgroundColor: 'var(--background-accent)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: profileBannerUrl ? `url(${profileBannerUrl})` : (user?.profileCustomization?.profileGradient || 'none'), // Use banner or gradient
          position: 'relative'
        }}>
          {editingProfileBanner && (
            <div className="p-2 bg-dark bg-opacity-50 position-absolute bottom-0 end-0 d-flex align-items-center">
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }} // Hide the default file input
                id="bannerUploadInput"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    const imageUrl = await handleFileUpload(e.target.files[0]);
                    if (imageUrl) setProfileBannerUrl(imageUrl);
                  }
                }}
              />
              <label htmlFor="bannerUploadInput" className="btn btn-sm btn-info me-2">Choose File</label> {/* Custom button */}
              <Button variant="success" size="sm" className="me-2" onClick={() => {
                if (user && updateUserProfile) {
                  updateUserProfile({ ...user, profileCustomization: { ...user.profileCustomization, profileBannerUrl } });
                  setEditingProfileBanner(false);
                }
              }}>Save</Button>
              <Button variant="secondary" size="sm" onClick={() => {
                setProfileBannerUrl(user?.profileCustomization?.profileBannerUrl || '');
                setEditingProfileBanner(false);
              }}>Cancel</Button>
            </div>
          )}
          {!editingProfileBanner && (
            <Button variant="primary" size="sm" className="position-absolute bottom-0 end-0 m-2" onClick={() => setEditingProfileBanner(true)}>Change Banner</Button>
          )}
        </div>

        <Card.Body style={{ paddingTop: '75px', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '-75px',
            left: '20px',
            border: '5px solid var(--background-secondary)',
            borderRadius: '50%',
            width: '150px',
            height: '150px'
          }}>
            <img
              src={profilePictureUrl || '/default-avatar.png'}
              alt="Profile"
              className="rounded-circle"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <Card.Title as="h4" style={{ marginTop: '15px', fontWeight: '600' }}>{user.username}</Card.Title>
          
          {/* Profile Picture Editing UI */}
          {editingProfilePicture ? (
            <Form.Group className="mb-3 d-flex align-items-center">
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }} // Hide the default file input
                id="profilePictureUploadInput"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    const imageUrl = await handleFileUpload(e.target.files[0]);
                    if (imageUrl) setProfilePictureUrl(imageUrl);
                  }
                }}
              />
              <label htmlFor="profilePictureUploadInput" className="btn btn-sm btn-info me-2">Choose File</label> {/* Custom button */}
              <Button variant="success" size="sm" className="me-2" onClick={() => {
                if (user && updateUserProfile) {
                  updateUserProfile({ ...user, profilePictureUrl });
                  setEditingProfilePicture(false);
                }
              }}>Save Picture</Button>
              <Button variant="secondary" size="sm" onClick={() => {
                if (user) {
                  setProfilePictureUrl(user.profilePictureUrl);
                }
                setEditingProfilePicture(false);
              }}>Cancel</Button>
            </Form.Group>
          ) : (
            <Button variant="primary" size="sm" onClick={() => setEditingProfilePicture(true)} disabled={user?._id === '65f2a1b3c4d5e6f7a8b9c0d3'}>Change Picture</Button>
          )}

          <hr />

          <Card.Title>Status:</Card.Title>
          {editingStatus ? (
            <Form.Group className="mb-3">
              <Form.Control type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
              <Button variant="success" size="sm" className="mt-2 me-2" onClick={() => {
                if (user && updateUserProfile) {
                  updateUserProfile({ ...user, status });
                  setEditingStatus(false);
                }
              }}>Save</Button>
              <Button variant="secondary" size="sm" className="mt-2" onClick={() => setEditingStatus(false)}>Cancel</Button>
            </Form.Group>
          ) : (
            <Card.Text>{user.status || 'No status set.'}</Card.Text>
          )}
          {!editingStatus && <Button variant="primary" size="sm" onClick={() => setEditingStatus(true)}>Edit Status</Button>}

          <hr />

          <Card.Title>School:</Card.Title>
          {editingSchool ? (
            <Form.Group className="mb-3">
              <Form.Control type="text" value={school} onChange={(e) => setSchool(e.target.value)} />
              <Button variant="success" size="sm" className="mt-2 me-2" onClick={() => {
                if (user && updateUserProfile) {
                  updateUserProfile({ ...user, school });
                  setEditingSchool(false);
                }
              }}>Save</Button>
              <Button variant="secondary" size="sm" className="mt-2" onClick={() => setEditingSchool(false)}>Cancel</Button>
            </Form.Group>
          ) : (
            <Card.Text>{user.school || 'No school set.'}</Card.Text>
          )}
          {!editingSchool && <Button variant="primary" size="sm" onClick={() => setEditingSchool(true)}>Edit School</Button>}

          <hr />

          <Card.Title className="mt-4">Profile Customization:</Card.Title>
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <TextColorPicker />
            </div>
            <div className="col-md-6 mb-3">
              <BackgroundColorPicker />
            </div>
            <div className="col-md-6 mb-3">
              <ChatBubbleColorPicker />
            </div>
            <div className="col-md-6 mb-3">
              <ThemeToggle />
            </div>
            <div className="col-12 mb-3"> {/* Gradient picker takes full width */}
              <GradientPicker />
            </div>
          </div>

          <hr />

          <Card.Title className="mt-4">Saved Games:</Card.Title>
          {user.savedGames.length > 0 ? (
            <ListGroup>{user.savedGames.map((game) => (<ListGroup.Item key={game.id}>{game.name} - Saved on: {new Date(game.timestamp).toLocaleString()}</ListGroup.Item>))}</ListGroup>
          ) : (
            <Card.Text>No saved games yet.</Card.Text>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile;