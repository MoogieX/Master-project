"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import UserDisplayProfile from './UserDisplayProfile';
import { Modal } from 'react-bootstrap';

// Define the shape of a message
interface Message {
  _id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

// Define the shape of a user
interface ChatUser {
  _id: string;
  username: string;
  profilePictureUrl?: string;
}

const Messaging = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [allUsers, setAllUsers] = useState<ChatUser[]>([]);
  const [userMap, setUserMap] = useState<Map<string, ChatUser>>(new Map());
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch all users to display in the user list
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data: ChatUser[] = await res.json();
          setAllUsers(data);
          const map = new Map<string, ChatUser>();
          data.forEach((u) => map.set(u._id, u));
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

  // Fetch all public messages
  const fetchMessages = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/messages`);
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

  // Scroll to the bottom of the messages list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages on mount and then poll for new ones
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: user._id, content: newMessage }),
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages(); // Refresh messages immediately
      } else {
        console.error('Failed to send message:', await res.json());
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle opening the user profile modal
  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setShowUserProfileModal(true);
  };

  if (!user) {
    return <p className="text-center mt-5">Please log in to view the chat.</p>;
  }

  return (
    <>
      <div className="messaging-container">
        {/* Column 1: Channels/Servers (Placeholder) */}
        <div className="channels-column">
          {/* Placeholder for server icons */}
          <div className="user-avatar" style={{ backgroundColor: '#7289da' }}>G</div>
          <div className="user-avatar mt-2" style={{ backgroundColor: '#43b581' }}>V</div>
        </div>

        {/* Column 2: User List */}
        <div className="users-column">
          <h5 className="text-secondary text-uppercase small px-2 mb-2">Users</h5>
          <ul className="user-list">
            {allUsers.map((u) => (
              <li key={u._id} className="user-list-item" onClick={() => handleUserClick(u._id)}>
                <img src={u.profilePictureUrl || '/default-avatar.png'} alt={u.username} className="user-avatar" />
                <span>{u.username}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Chat Area */}
        <div className="chat-column">
          <div className="chat-messages">
            {messages.map((msg) => {
              const sender = userMap.get(msg.senderId);
              return (
                <div key={msg._id} className="message-group">
                  <div className="message">
                    <img src={sender?.profilePictureUrl || '/default-avatar.png'} alt={sender?.username} className="user-avatar" />
                    <div>
                      <div>
                        <span className="username" style={{ color: user?.profileCustomization?.chatBubbleColor || 'var(--text-link)' }} onClick={() => handleUserClick(msg.senderId)}>{sender?.username || 'Unknown'}</span>
                        <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="message-content">{msg.content}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-form">
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <Modal show={showUserProfileModal} onHide={() => setShowUserProfileModal(false)} centered>
        <Modal.Body style={{ backgroundColor: 'var(--background-tertiary)'}}>
          {selectedUserId && <UserDisplayProfile userId={selectedUserId} onClose={() => setShowUserProfileModal(false)} />}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Messaging;
