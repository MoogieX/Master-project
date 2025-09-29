"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Form, Button, ListGroup, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

// Define the shape of a message for the frontend
interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string; // ISO date string
  read: boolean;
}

const Messaging = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]); // State to store all users
  const [userMap, setUserMap] = useState<Map<string, string>>(new Map()); // Map userId to username

  // No longer hardcoding recipient, as it's a public forum
  // We will fetch all messages of type 'public_forum'

  // Fetch all users to map senderId to username
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch('/api/users'); // Fetch all users
        if (res.ok) {
          const data = await res.json();
          setAllUsers(data);
          const map = new Map<string, string>();
          data.forEach((u: any) => map.set(u._id, u.username));
          setUserMap(map);
        } else {
          console.error('Failed to fetch all users:', await res.json());
        }
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };
    fetchAllUsers();
  }, []);


  const fetchMessages = useCallback(async () => {
    if (!user) return; // Only need user to be logged in

    try {
      const res = await fetch(`/api/messages`); // Fetch all public messages
      if (res.ok) {
        const data: Message[] = await res.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch messages:', await res.json());
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchMessages();
    // Optional: Poll for new messages every few seconds (for basic real-time)
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return; // Removed recipientId check

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user._id,
          // recipientId, // Removed recipientId
          content: newMessage,
        }),
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages(); // Refresh messages after sending
      } else {
        console.error('Failed to send message:', await res.json());
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user) {
    return <p>Please log in to view messages.</p>;
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h5">Public Forum</Card.Header> {/* Changed header */}
        <Card.Body>
          <ListGroup variant="flush" className="mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {messages.map((msg) => (
              <ListGroup.Item
                key={msg._id}
                className={`d-flex ${msg.senderId === user._id ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`p-2 rounded`}
                  style={{
                    maxWidth: '70%',
                    backgroundColor: msg.senderId === user._id ? (user.profileCustomization.chatBubbleColor || 'var(--primary-color)') : 'var(--card-bg)', // Use user's custom color or default
                    color: msg.senderId === user._id ? 'var(--navbar-text)' : 'var(--card-text)', // Use theme variables
                  }}
                >
                  <strong>{msg.senderId === user._id ? 'You' : userMap.get(msg.senderId) || 'Unknown'}:</strong> {msg.content} {/* Show sender username */}
                  <div className="text-muted small" style={{ fontSize: '0.75em' }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Form onSubmit={handleSendMessage}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                aria-label="New message"
              />
              <Button variant="primary" type="submit">
                Send
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Messaging;