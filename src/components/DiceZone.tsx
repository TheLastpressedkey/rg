import React, { useState } from 'react';
import { Dice } from './Dice';
import { DiceValue, DiceState } from '../types/dice';
import { RotateCcw, Dices } from 'lucide-react';

interface DiceZoneProps {
  onDiceRolled?: (result: DiceValue) => void;
}

export const DiceZone: React.FC<DiceZoneProps> = ({ onDiceRolled }) => {
  const [diceState, setDiceState] = useState<DiceState>({
    isRolling: false,
    currentValue: null,
    rollHistory: []
  });

  const rollDice = () => {
    if (diceState.isRolling) return;

    setDiceState(prev => ({ ...prev, isRolling: true }));

    // Animation duration
    setTimeout(() => {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      const total = dice1 + dice2;
      const rolledAt = Date.now();

      const newValue: DiceValue = { dice1, dice2, total, rolledAt };

      setDiceState(prev => ({
        isRolling: false,
        currentValue: newValue,
        rollHistory: [newValue, ...prev.rollHistory.slice(0, 4)] // Keep last 5 rolls
      }));

      onDiceRolled?.(newValue);
    }, 1000);
  };

  const resetDice = () => {
    setDiceState({
      isRolling: false,
      currentValue: null,
      rollHistory: []
    });
  };

  const getDisplayValue = () => {
    if (diceState.isRolling) return '---';
    if (diceState.currentValue) return diceState.currentValue.total.toString().padStart(2, '0');
    return '00';
  };

  return (
    <div className="flex flex-col items-center space-y-3 p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-600 min-w-[140px]">
      
      {/* LCD Display Screen - Compact */}
      <div className="w-full bg-gradient-to-b from-gray-900 to-black rounded-md p-2 border border-gray-700 shadow-inner">
        {/* LCD Screen Bezel */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded p-2 border border-gray-600">
          {/* LCD Screen */}
          <div className="bg-gradient-to-b from-green-900 to-green-950 rounded border border-green-800 p-2 relative overflow-hidden">
            {/* LCD Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-6 grid-rows-3 h-full w-full">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="border border-green-700 border-opacity-30"></div>
                ))}
              </div>
            </div>
            
            {/* LCD Display Content */}
            <div className="relative z-10 text-center">
              {/* Main Display Value */}
              <div className={`
                font-mono text-2xl font-bold tracking-wider
                ${diceState.isRolling 
                  ? 'text-green-400 animate-pulse' 
                  : 'text-green-300'
                }
                filter drop-shadow-lg
              `}>
                {getDisplayValue()}
              </div>
              
              {/* LCD Segments Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-20 animate-pulse"></div>
            </div>
            
            {/* LCD Corner Indicators */}
            <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-green-500 rounded-full opacity-60"></div>
            <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-green-500 rounded-full opacity-60"></div>
            <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-green-500 rounded-full opacity-60"></div>
            <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-green-500 rounded-full opacity-60"></div>
          </div>
          
          {/* LCD Brand Label */}
          <div className="text-center mt-1">
            <div className="text-gray-400 text-xs font-mono tracking-wide">DICE-LCD</div>
          </div>
        </div>
      </div>

      {/* Dice Display - Compact */}
      <div 
        className="flex items-center space-x-2 cursor-pointer p-2 rounded-md bg-gray-700 bg-opacity-50 hover:bg-opacity-70 transition-all duration-200 border border-dashed border-gray-500 hover:border-blue-400"
        onClick={rollDice}
      >
        <Dice 
          value={diceState.currentValue?.dice1 || 1} 
          isRolling={diceState.isRolling}
          size="small"
        />
        <div className="text-white text-sm font-bold">+</div>
        <Dice 
          value={diceState.currentValue?.dice2 || 1} 
          isRolling={diceState.isRolling}
          size="small"
        />
      </div>

      {/* Controls - Compact */}
      <div className="flex space-x-1">
        <button
          onClick={rollDice}
          disabled={diceState.isRolling}
          className={`
            px-3 py-1 rounded text-xs font-medium transition-all duration-200
            ${diceState.isRolling 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
            }
          `}
        >
          {diceState.isRolling ? 'Lance...' : 'Lancer'}
        </button>

        {diceState.currentValue && (
          <button
            onClick={resetDice}
            className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Roll History - Compact */}
      {diceState.rollHistory.length > 0 && (
        <div className="w-full">
          <div className="text-gray-400 text-xs mb-1 text-center">Historique</div>
          <div className="flex flex-wrap justify-center gap-1">
            {diceState.rollHistory.slice(0, 5).map((roll, index) => (
              <div
                key={roll.rolledAt}
                className={`
                  px-1.5 py-0.5 rounded text-xs font-medium
                  ${index === 0 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300'
                  }
                `}
              >
                {roll.total}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};