import React, { useState } from 'react';
import { TarotCard } from './TarotCard';
import { TarotCard as TarotCardType, DrawnCard } from '../types/tarot';
import { tarotCards } from '../data/tarotCards';

interface TarotDeckProps {
  onCardDrawn: (card: DrawnCard) => void;
}

export const TarotDeck: React.FC<TarotDeckProps> = ({ onCardDrawn }) => {
  const [remainingCards, setRemainingCards] = useState<TarotCardType[]>(tarotCards);
  const [isDrawing, setIsDrawing] = useState(false);

  const drawCard = () => {
    if (remainingCards.length === 0 || isDrawing) return;

    setIsDrawing(true);
    
    // Random card selection
    const randomIndex = Math.floor(Math.random() * remainingCards.length);
    const drawnCard = remainingCards[randomIndex];
    
    // Remove card from deck
    const newRemainingCards = remainingCards.filter((_, index) => index !== randomIndex);
    setRemainingCards(newRemainingCards);

    // Create drawn card with position
    const drawnCardWithPosition: DrawnCard = {
      ...drawnCard,
      position: {
        x: 0,
        y: 0,
        rotation: Math.random() * 10 - 5, // Random slight rotation
        zIndex: Date.now()
      },
      drawnAt: Date.now(),
      isReversed: Math.random() > 0.5 // 50% chance of being reversed
    };

    // Animate card draw
    setTimeout(() => {
      onCardDrawn(drawnCardWithPosition);
      setIsDrawing(false);
    }, 300);
  };

  const resetDeck = () => {
    setRemainingCards(tarotCards);
  };

  return (
    <div className="relative">
      {/* Deck stack */}
      <div className="relative w-24 h-36">
        {/* Show multiple cards stacked to create depth effect */}
        {remainingCards.slice(0, 5).map((_, index) => (
          <TarotCard
            key={`deck-${index}`}
            card={remainingCards[0]}
            position={{
              x: index * 1,
              y: -index * 1,
              rotation: index * 0.5,
              zIndex: 5 - index
            }}
            isInDeck={true}
            onClick={index === 0 ? drawCard : undefined}
            className={`
              ${index === 0 ? 'cursor-pointer' : 'cursor-default'}
              ${isDrawing && index === 0 ? 'animate-pulse' : ''}
            `}
          />
        ))}
        
        {/* Empty deck indicator */}
        {remainingCards.length === 0 && (
          <div className="w-24 h-36 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-2">Deck vide</div>
              <button
                onClick={resetDeck}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
              >
                Mélanger
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Deck info */}
      <div className="mt-2 text-center">
        <div className="text-white text-sm font-medium">
          Deck de Tarot
        </div>
        <div className="text-gray-400 text-xs">
          {remainingCards.length} cartes restantes
        </div>
        {remainingCards.length > 0 && (
          <div className="text-gray-500 text-xs mt-1">
            Cliquez pour piocher
          </div>
        )}
      </div>
    </div>
  );
};