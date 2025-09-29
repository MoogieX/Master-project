"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password');
    } else {
      setUsername('');
      setPassword('');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 56px)' }}> {/* Adjusted minHeight */}
      <Card style={{ width: '30rem', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}> {/* Added boxShadow */}
        <Card.Body>
          <h2 className="text-center mb-4">Game Hub Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button className="w-100 mt-4" type="submit">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;