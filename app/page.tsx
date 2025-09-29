"use client";

import React, { useState } from 'react'; // Import useState
import Link from 'next/link'; // Import Link from next/link
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import UserProfile from './components/UserProfile'; // Import UserProfile
import Messaging from './components/Messaging'; // Import Messaging
import GamesList from './components/GamesList'; // Import GamesList
import ProjectsList from './components/ProjectsList'; // Import ProjectsList
import MoviesPage from './components/MoviesPage'; // Import MoviesPage
import MusicPage from './components/MusicPage'; // Import MusicPage

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false); // State to control profile visibility
  const [showMessaging, setShowMessaging] = useState(false); // State to control messaging visibility
  const [showGames, setShowGames] = useState(true); // Default to showing games
  const [showProjects, setShowProjects] = useState(false);
  const [showMovies, setShowMovies] = useState(false);
  const [showMusic, setShowMusic] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div> {/* Changed from <> to <div> */}
      <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand>Game Hub</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="me-auto">
              <Nav.Link onClick={() => {
                setShowProfile(false);
                setShowMessaging(false);
                setShowGames(true); // Show games by default on Home
                setShowProjects(false);
                setShowMovies(false);
                setShowMusic(false);
              }}>Home</Nav.Link> {/* Home Link */}
              <Nav.Link onClick={() => {
                setShowProfile(false);
                setShowMessaging(false);
                setShowGames(true);
                setShowProjects(false);
                setShowMovies(false);
                setShowMusic(false);
              }}>Games</Nav.Link> {/* Games Link */}
              <Nav.Link onClick={() => {
                setShowProfile(false);
                setShowMessaging(false);
                setShowGames(false);
                setShowProjects(true);
                setShowMovies(false);
                setShowMusic(false);
              }}>Projects</Nav.Link> {/* Projects Link */}
              <Nav.Link onClick={() => {
                setShowProfile(false);
                setShowMessaging(false);
                setShowGames(false);
                setShowProjects(false);
                setShowMovies(true);
                setShowMusic(false);
              }}>Movies</Nav.Link> {/* Movies Link */}
              <Nav.Link onClick={() => {
                setShowProfile(false);
                setShowMessaging(false);
                setShowGames(false);
                setShowProjects(false);
                setShowMovies(false);
                setShowMusic(true);
              }}>Music</Nav.Link> {/* Music Link */}
              <Nav.Link onClick={() => setShowMessaging(true)}>Messaging</Nav.Link> {/* Messaging Link */}
              <Nav.Link onClick={() => setShowProfile(true)}>Profile</Nav.Link> {/* Profile Link */}
            </Nav>
            <Nav className="d-flex align-items-center"> {/* Added d-flex and align-items-center for alignment */} 
              <Navbar.Text className="me-3 mb-0"> {/* Added mb-0 to remove bottom margin */} 
                Signed in as: <strong>{user?.username}</strong>
              </Navbar.Text>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showMessaging ? (
        <Messaging />
      ) : showProfile ? (
        <UserProfile />
      ) : showGames ? (
        <GamesList />
      ) : showProjects ? (
        <ProjectsList />
      ) : showMovies ? (
        <MoviesPage />
      ) : showMusic ? (
        <MusicPage />
      ) : (
        <Container className="mt-5 pt-5">
          <h1>Welcome to your Master Project Hub!</h1>
          <p>This is where you can manage and launch your web-based games and mini-projects.</p>
          {/* Default content if nothing else is shown */}
        </Container>
      )}    </div>
  );
}