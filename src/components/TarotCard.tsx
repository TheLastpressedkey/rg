import React from 'react';
import { TarotCard as TarotCardType, CardPosition } from '../types/tarot';

interface TarotCardProps {
  card: TarotCardType;
  position?: CardPosition;
  isInDeck?: boolean;
  onClick?: () => void;
  className?: string;
}

export const TarotCard: React.FC<TarotCardProps> = ({ 
  card, 
  position, 
  isInDeck = false, 
  onClick,
  className = ''
}) => {
  const cardStyle = position ? {
    transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotation}deg)`,
    zIndex: position.zIndex
  } : {};

  const cardSize = isInDeck ? 'w-24 h-36' : 'w-20 h-28';

  return (
    <div
      className={`
        ${cardSize} cursor-pointer transition-all duration-300 hover:scale-105
        ${isInDeck ? 'absolute hover:translate-y-[-4px]' : 'relative'}
        ${className}
      `}
      style={cardStyle}
      onClick={onClick}
    >
      {/* Card back design for deck */}
      {isInDeck ? (
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-black rounded-lg border-2 border-yellow-400 shadow-lg relative overflow-hidden">
          {/* Mystical pattern */}
          <div className="absolute inset-2 border border-yellow-400 rounded-md">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-yellow-400 rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-yellow-400 rounded-full opacity-80"></div>
              </div>
            </div>
            {/* Decorative corners */}
            <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-yellow-400"></div>
            <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-yellow-400"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-yellow-400"></div>
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-yellow-400"></div>
          </div>
          
          {/* Mystical symbols */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs">✦</div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs">✦</div>
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-yellow-400 text-xs">◊</div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-400 text-xs">◊</div>
        </div>
      ) : (
        /* Card front design */
        <div className="w-full h-full bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg border-2 border-amber-600 shadow-lg relative overflow-hidden">
          {/* Card border */}
          <div className="absolute inset-1 border-2 border-amber-700 rounded-md">
            {/* Card content */}
            <div className="w-full h-full p-1 flex flex-col">
              {/* Card number/title at top */}
              <div className="text-center text-xs font-bold text-amber-900 mb-1 leading-tight">
                {card.name.length > 12 ? card.name.substring(0, 12) + '...' : card.name.toUpperCase()}
              </div>
              
              {/* Main card image area */}
              <div className="flex-1 bg-gradient-to-br from-orange-300 to-amber-400 rounded border border-amber-700 flex items-center justify-center relative overflow-hidden">
                {/* Mystical design inspired by the references */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Central eye symbol */}
                  <div className="w-6 h-4 bg-amber-800 rounded-full flex items-center justify-center relative">
                    <div className="w-2 h-2 bg-amber-200 rounded-full">
                      <div className="w-0.5 h-0.5 bg-amber-900 rounded-full mx-auto mt-0.5"></div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0.5 left-0.5 text-amber-800 text-xs">✦</div>
                <div className="absolute top-0.5 right-0.5 text-amber-800 text-xs">✦</div>
                <div className="absolute bottom-0.5 left-0.5 text-amber-800 text-xs">✧</div>
                <div className="absolute bottom-0.5 right-0.5 text-amber-800 text-xs">✧</div>
                
                {/* Geometric patterns */}
                <div className="absolute inset-1 border border-amber-700 rounded opacity-30"></div>
              </div>
              
              {/* Card description at bottom */}
              <div className="text-center text-xs text-amber-900 mt-1 font-medium leading-tight">
                {card.name.length > 10 ? card.name.substring(0, 10) + '...' : card.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};