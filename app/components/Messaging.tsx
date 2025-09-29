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
  const [recipientId, setRecipientId] = useState(''); // For now, hardcode or select a recipient
  const [conversationPartner, setConversationPartner] = useState(''); // Display name of partner

  // For demonstration, let's assume the other user is 'Moogietheboogie' (ID: 65f2a1b3c4d5e6f7a8b9c0d2)
  // In a real app, you'd have a list of friends to choose from.
  useEffect(() => {
    if (user && user._id === '65f2a1b3c4d5e6f7a8b9c0d1') { // If current user is ringthebell02
      setRecipientId('65f2a1b3c4d5e6f7a8b9c0d2');
      setConversationPartner('Moogietheboogie');
    } else if (user && user._id === '65f2a1b3c4d5e6f7a8b9c0d2') { // If current user is Moogietheboogie
      setRecipientId('65f2a1b3c4d5e6f7a8b9c0d1');
      setConversationPartner('ringthebell02');
    }
  }, [user]);


  const fetchMessages = useCallback(async () => {
    if (!user || !recipientId) return;

    try {
      const res = await fetch(`/api/messages?userId=${user._id}&conversationPartnerId=${recipientId}`);
      if (res.ok) {
        const data: Message[] = await res.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch messages:', await res.json());
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [user, recipientId]);

  useEffect(() => {
    fetchMessages();
    // Optional: Poll for new messages every few seconds (for basic real-time)
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !recipientId || !newMessage.trim()) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user._id,
          recipientId,
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

  if (!recipientId) {
    return <p>Select a conversation partner to start messaging.</p>;
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h5">Messaging with {conversationPartner}</Card.Header>
        <Card.Body>
          <ListGroup variant="flush" className="mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {messages.map((msg) => (
              <ListGroup.Item
                key={msg._id}
                className={`d-flex ${msg.senderId === user._id ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`p-2 rounded ${msg.senderId === user._id ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                  style={{ maxWidth: '70%' }}
                >
                  <strong>{msg.senderId === user._id ? 'You' : conversationPartner}:</strong> {msg.content}
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