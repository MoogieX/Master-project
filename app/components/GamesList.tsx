import React, { useState } from 'react'; // Import useState
import { Container, Card, Button, Alert } from 'react-bootstrap'; // Import Alert
import { useAuth } from '../context/AuthContext'; // Import useAuth

const GamesList = () => {
  const { user } = useAuth();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveGame = async (gameId: string, saveName: string, gameState: any) => {
    if (!user?._id) {
      setSaveMessage('Please log in to save games.');
      return;
    }

    try {
      const res = await fetch('/api/gamesaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          userId: user._id,
          saveName,
          data: gameState,
        }),
      });

      if (res.ok) {
        setSaveMessage(`Game "${saveName}" for ${gameId} saved successfully!`);
      } else {
        setSaveMessage(`Failed to save game "${saveName}" for ${gameId}.`);
        console.error('Failed to save game:', await res.json());
      }
    } catch (error) {
      setSaveMessage(`Error saving game "${saveName}" for ${gameId}.`);
      console.error('Error saving game:', error);
    }
  };

  const handleLoadGame = async (gameId: string) => {
    if (!user?._id) {
      setSaveMessage('Please log in to load games.');
      return;
    }

    try {
      const res = await fetch(`/api/gamesaves?userId=${user._id}&gameId=${gameId}`);
      if (res.ok) {
        const saves = await res.json();
        if (saves.length > 0) {
          const latestSave = saves[0]; // Load the latest save
          setSaveMessage(`Game "${latestSave.saveName}" for ${gameId} loaded successfully! State: ${JSON.stringify(latestSave.data)}`);
          // Here you would integrate with your actual game to load latestSave.data
        } else {
          setSaveMessage(`No saves found for ${gameId}.`);
        }
      } else {
        setSaveMessage(`Failed to load game saves for ${gameId}.`);
        console.error('Failed to load game saves:', await res.json());
      }
    } catch (error) {
      setSaveMessage(`Error loading game saves for ${gameId}.`);
      console.error('Error loading game saves:', error);
    }
  };

  return (
    <Container className="mt-5 pt-5">
      <h2>Your Games</h2>
      <p>Explore your collection of web-based games.</p>
      {saveMessage && <Alert variant="info">{saveMessage}</Alert>} {/* Display save/load messages */}
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <img src="/voidfallen.jpg" className="card-img-top" alt="Voidfallen" style={{ height: '180px', objectFit: 'cover' }} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Voidfallen</h5>
              <p className="card-text flex-grow-1">Your Python game's web version.</p>
              <div className="d-flex justify-content-between mt-auto">
                <a href="/voidfallen" className="btn btn-primary">Play Now</a>
                <Button variant="success" onClick={() => handleSaveGame('voidfallen', 'AutoSave', { level: 1, score: 100 })}>Save</Button>
                <Button variant="info" onClick={() => handleLoadGame('voidfallen')}>Load</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <img src="/starfallen.jpg" className="card-img-top" alt="Starfallen" style={{ height: '180px', objectFit: 'cover' }} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Starfallen</h5>
              <p className="card-text flex-grow-1">Your sci-fi RPG.</p>
              <div className="d-flex justify-content-between mt-auto">
                <a href="/starfallen" className="btn btn-primary">Play Now</a>
                <Button variant="success" onClick={() => handleSaveGame('starfallen', 'Checkpoint', { planet: 'Mars', progress: '50%' })}>Save</Button>
                <Button variant="info" onClick={() => handleLoadGame('starfallen')}>Load</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};