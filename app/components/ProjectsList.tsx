"use client";

import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';

const ProjectsList = () => {
  return (
    <Container className="mt-5 pt-5">
      <h2>Your Mini-Projects</h2>
      <p>Manage your other mini-projects here.</p>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <img src="/thecheat.jpg" className="card-img-top" alt="The Cheat" style={{ height: '180px', objectFit: 'cover' }} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">The Cheat</h5>
              <p className="card-text flex-grow-1">Your school work helper.</p>
              <a href="/the-cheat" className="btn btn-primary mt-auto">View Project</a>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProjectsList;