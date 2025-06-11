import React from 'react';
import { TarotCard } from './TarotCard';
import { DrawnCard } from '../types/tarot';
import { X } from 'lucide-react';

interface CardSlotProps {
  card?: DrawnCard;
  slotIndex: number;
  onCardRemove?: (slotIndex: number) => void;
}

export const CardSlot: React.FC<CardSlotProps> = ({ card, slotIndex, onCardRemove }) => {
  return (
    <div className="relative w-24 h-32 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800 bg-opacity-30 flex items-center justify-center transition-all duration-200 hover:border-gray-500 hover:bg-gray-700 hover:bg-opacity-40">
      {card ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-20 h-28">
            <TarotCard
              card={card}
              position={{
                x: 0,
                y: 0,
                rotation: card.position.rotation,
                zIndex: 1
              }}
              isInDeck={false}
            />
          </div>
          
          {/* Remove button */}
          {onCardRemove && (
            <button
              onClick={() => onCardRemove(slotIndex)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-20 shadow-lg border border-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          
          {/* Card info tooltip */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-3 py-1 rounded-md opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
            {card.name}
            {card.isReversed && ' (Inversée)'}
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center p-2">
          <div className="mb-2">
            <div className="w-8 h-8 mx-auto border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
              {slotIndex + 1}
            </div>
          </div>
          <div className="text-gray-600 text-xs">Zone vide</div>
        </div>
      )}
    </div>
  );
};