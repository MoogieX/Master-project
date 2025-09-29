"use client";

import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';

const MusicPage = () => {
  return (
    <Container className="mt-5 pt-5">
      <h2>Your Music</h2>
      <p>Listen to your favorite tracks here.</p>
      <div className="row">
        {/* Placeholder for music cards */}
        <div className="col-md-4 mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src="https://via.placeholder.com/300x200?text=Album+1" style={{ height: '180px', objectFit: 'cover' }} />
            <Card.Body className="d-flex flex-column">
              <Card.Title>Album Title 1</Card.Title>
              <Card.Text className="flex-grow-1">Artist Name 1 - Genre</Card.Text>
              <Button variant="primary" className="mt-auto">Play Song</Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4 mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src="https://via.placeholder.com/300x200?text=Album+2" style={{ height: '180px', objectFit: 'cover' }} />
            <Card.Body className="d-flex flex-column">
              <Card.Title>Album Title 2</Card.Title>
              <Card.Text className="flex-grow-1">Artist Name 2 - Genre</Card.Text>
              <Button variant="primary" className="mt-auto">Play Song</Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default MusicPage;