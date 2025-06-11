import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from './components/StatusBar';
import { MainContent, MainContentRef } from './components/MainContent';
import { SetupScreen } from './components/SetupScreen';
import { User } from './types';
import { generateUserColor, generateUserId } from './utils/colors';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const [gameState, setGameState] = useState<'setup' | 'playing'>('setup');
  const [gameId, setGameId] = useState<string | null>(null);
  const [user, setUser] = useState<User>(() => ({
    id: generateUserId(),
    name: '',
    color: generateUserColor(),
    lastSeen: Date.now()
  }));

  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasActiveZones, setHasActiveZones] = useState(false);
  const mainContentRef = useRef<MainContentRef>(null);

  // Check URL for game invitation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get('game');
    
    if (gameParam) {
      setGameId(gameParam);
    }
  }, []);

  // WebSocket connection (only when playing)
  const { isConnected, users } = useWebSocket(
    gameState === 'playing' && gameId ? gameId : '', 
    gameState === 'playing' ? user : { ...user, name: '' }
  );

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCreateGame = (userName: string) => {
    const newGameId = Math.random().toString(36).substr(2, 8).toUpperCase();
    setUser(prev => ({ ...prev, name: userName, lastSeen: Date.now() }));
    setGameId(newGameId);
    setGameState('playing');
    
    // Update URL without page reload
    window.history.pushState({}, '', `?game=${newGameId}`);
  };

  const handleJoinGame = (userName: string, joinGameId: string) => {
    setUser(prev => ({ ...prev, name: userName, lastSeen: Date.now() }));
    setGameId(joinGameId);
    setGameState('playing');
  };

  const handleClearAllZones = () => {
    if (mainContentRef.current) {
      mainContentRef.current.clearAllCards();
    }
  };

  const handleZoneActivity = (hasActive: boolean) => {
    setHasActiveZones(hasActive);
  };

  // Show setup screen if not playing
  if (gameState === 'setup') {
    return (
      <SetupScreen
        onCreateGame={handleCreateGame}
        onJoinGame={handleJoinGame}
        gameId={gameId || undefined}
      />
    );
  }

  // Show main game interface
  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 relative">
        <MainContent 
          ref={mainContentRef}
          onZoneActivity={handleZoneActivity}
          players={[user, ...users]}
          currentUserId={user.id}
          isConnected={isConnected}
          gameId={gameId || undefined}
        />
      </div>

      {/* Status Bar */}
      <StatusBar 
        user={user}
        currentTime={currentTime}
        onUserChange={setUser}
        onClearAllZones={handleClearAllZones}
        hasActiveZones={hasActiveZones}
      />
    </div>
  );
}

export default App;