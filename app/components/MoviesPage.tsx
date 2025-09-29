"use client";

import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';

const MoviesPage = () => {
  return (
    <Container className="mt-5 pt-5">
      <h2>Your Movies</h2>
      <p>Browse your movie collection here.</p>
      <div className="row">
        {/* Placeholder for movie cards */}
        <div className="col-md-4 mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src="https://via.placeholder.com/300x200?text=Movie+1" style={{ height: '180px', objectFit: 'cover' }} />
            <Card.Body className="d-flex flex-column">
              <Card.Title>Movie Title 1</Card.Title>
              <Card.Text className="flex-grow-1">A brief description of Movie 1.</Card.Text>
              <Button variant="primary" className="mt-auto">Watch Now</Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4 mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src="https://via.placeholder.com/300x200?text=Movie+2" style={{ height: '180px', objectFit: 'cover' }} />
            <Card.Body className="d-flex flex-column">
              <Card.Title>Movie Title 2</Card.Title>
              <Card.Text className="flex-grow-1">A brief description of Movie 2.</Card.Text>
              <Button variant="primary" className="mt-auto">Watch Now</Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default MoviesPage;