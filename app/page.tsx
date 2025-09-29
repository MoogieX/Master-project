"use client";

import React, { useState } from 'react'; // Import useState
import Link from 'next/link'; // Import Link from next/link
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import UserProfile from './components/UserProfile'; // Import UserProfile

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false); // State to control profile visibility

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
              <Nav.Link onClick={() => setShowProfile(false)}>Home</Nav.Link> {/* Home Link */}
              <Nav.Link href="#games">Games</Nav.Link>
              <Nav.Link href="#projects">Projects</Nav.Link>
              <Nav.Link href="#messaging">Messaging</Nav.Link>
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

      {showProfile ? (
        <UserProfile />
      ) : (
        <Container className="mt-5 pt-5">
          <h1>Welcome to your Master Project Hub!</h1>
          <p>This is where you can manage and launch your web-based games and mini-projects.</p>

          <section id="games" className="my-5">
            <h2>Your Games</h2>
            <p>Explore your collection of web-based games.</p>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm"> {/* Added h-100 and shadow-sm */}
                  <img src="/voidfallen.jpg" className="card-img-top" alt="Voidfallen" style={{ height: '180px', objectFit: 'cover' }} /> {/* Added image */}
                  <div className="card-body d-flex flex-column"> {/* Added d-flex flex-column */}
                    <h5 className="card-title">Voidfallen</h5>
                    <p className="card-text flex-grow-1">Your Python game's web version.</p> {/* Added flex-grow-1 */}
                    <a href="/voidfallen" className="btn btn-primary mt-auto">Play Now</a> {/* Added mt-auto */}
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm"> {/* Added h-100 and shadow-sm */}
                  <img src="/starfallen.jpg" className="card-img-top" alt="Starfallen" style={{ height: '180px', objectFit: 'cover' }} /> {/* Added image */}
                  <div className="card-body d-flex flex-column"> {/* Added d-flex flex-column */}
                    <h5 className="card-title">Starfallen</h5>
                    <p className="card-text flex-grow-1">Your sci-fi RPG.</p> {/* Added flex-grow-1 */}
                    <a href="/starfallen" className="btn btn-primary mt-auto">Play Now</a> {/* Added mt-auto */}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="projects" className="my-5">
            <h2>Your Mini-Projects</h2>
            <p>Manage your other mini-projects here.</p>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm"> {/* Added h-100 and shadow-sm */}
                  <img src="/thecheat.jpg" className="card-img-top" alt="The Cheat" style={{ height: '180px', objectFit: 'cover' }} /> {/* Added image */}
                  <div className="card-body d-flex flex-column"> {/* Added d-flex flex-column */}
                    <h5 className="card-title">The Cheat</h5>
                    <p className="card-text flex-grow-1">Your school work helper.</p> {/* Added flex-grow-1 */}
                    <a href="/the-cheat" className="btn btn-primary mt-auto">View Project</a> {/* Added mt-auto */}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="messaging" className="my-5">
            <h2>Messaging</h2>
            <p>Future messaging features will appear here.</p>
          </section>
        </Container>
      )}
    </div>
  );
}