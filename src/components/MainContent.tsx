import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TarotDeck } from './TarotDeck';
import { CardSlot } from './CardSlot';
import { DiceZone } from './DiceZone';
import { PlayersPanel } from './PlayersPanel';
import { DrawnCard } from '../types/tarot';
import { DiceValue } from '../types/dice';
import { User } from '../types';

interface MainContentProps {
  onZoneActivity?: (hasActive: boolean) => void;
  players: User[];
  currentUserId: string;
  isConnected: boolean;
  gameId?: string;
}

export interface MainContentRef {
  clearAllCards: () => void;
}

export const MainContent = forwardRef<MainContentRef, MainContentProps>(({ 
  onZoneActivity, 
  players, 
  currentUserId, 
  isConnected, 
  gameId 
}, ref) => {
  const [drawnCards, setDrawnCards] = useState<(DrawnCard | null)[]>(
    Array(10).fill(null)
  );

  const handleCardDrawn = (card: DrawnCard) => {
    // Find first empty slot
    const emptySlotIndex = drawnCards.findIndex(slot => slot === null);
    if (emptySlotIndex !== -1) {
      const newDrawnCards = [...drawnCards];
      newDrawnCards[emptySlotIndex] = card;
      setDrawnCards(newDrawnCards);
      
      // Notify parent that zones are now active
      onZoneActivity?.(true);
    }
  };

  const handleCardRemove = (slotIndex: number) => {
    const newDrawnCards = [...drawnCards];
    newDrawnCards[slotIndex] = null;
    setDrawnCards(newDrawnCards);
    
    // Check if any zones are still active
    const hasActiveZones = newDrawnCards.some(card => card !== null);
    onZoneActivity?.(hasActiveZones);
  };

  const clearAllCards = () => {
    setDrawnCards(Array(10).fill(null));
    onZoneActivity?.(false);
  };

  // Expose clearAllCards function to parent via ref
  useImperativeHandle(ref, () => ({
    clearAllCards
  }));

  const handleDiceRolled = (result: DiceValue) => {
    console.log('Dés lancés:', result);
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col overflow-hidden relative">
      
      {/* Players Panel - Position absolue dans le coin gauche */}
      <div className="absolute top-4 left-4 z-10">
        <PlayersPanel
          players={players}
          currentUserId={currentUserId}
          isConnected={isConnected}
          gameId={gameId}
        />
      </div>

      {/* Main game area - centré avec plus d'espace */}
      <div className="flex-1 flex items-center justify-center px-8 py-6 min-h-0">
        
        {/* Left side - Tarot Deck (Zone D) */}
        <div className="flex items-center justify-center mr-12">
          <TarotDeck onCardDrawn={handleCardDrawn} />
        </div>

        {/* Center - Card slots in 2 horizontal rows of 5 cards each */}
        <div className="flex flex-col items-center space-y-6 mr-12">
          {/* First row - Cards 1-5 */}
          <div className="flex items-center space-x-4">
            {drawnCards.slice(0, 5).map((card, index) => (
              <CardSlot
                key={index}
                card={card}
                slotIndex={index}
                onCardRemove={handleCardRemove}
              />
            ))}
          </div>
          
          {/* Second row - Cards 6-10 */}
          <div className="flex items-center space-x-4">
            {drawnCards.slice(5, 10).map((card, index) => (
              <CardSlot
                key={index + 5}
                card={card}
                slotIndex={index + 5}
                onCardRemove={handleCardRemove}
              />
            ))}
          </div>
        </div>

        {/* Right side - Dice Zone (Zone X) */}
        <div className="flex items-center justify-center">
          <DiceZone onDiceRolled={handleDiceRolled} />
        </div>
      </div>
    </div>
  );
});