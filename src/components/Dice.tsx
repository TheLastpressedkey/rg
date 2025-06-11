import React from 'react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Dice: React.FC<DiceProps> = ({ 
  value, 
  isRolling, 
  size = 'medium',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const dotSizes = {
    small: 'w-1.5 h-1.5',
    medium: 'w-2 h-2',
    large: 'w-2.5 h-2.5'
  };

  const renderDots = (num: number) => {
    const dotClass = `${dotSizes[size]} bg-gray-800 rounded-full`;
    
    const dotPatterns = {
      1: (
        <div className="flex items-center justify-center w-full h-full">
          <div className={dotClass} />
        </div>
      ),
      2: (
        <div className="flex justify-between items-center w-full h-full p-2">
          <div className={dotClass} />
          <div className={dotClass} />
        </div>
      ),
      3: (
        <div className="flex flex-col justify-between w-full h-full p-2">
          <div className="flex justify-start">
            <div className={dotClass} />
          </div>
          <div className="flex justify-center">
            <div className={dotClass} />
          </div>
          <div className="flex justify-end">
            <div className={dotClass} />
          </div>
        </div>
      ),
      4: (
        <div className="grid grid-cols-2 gap-2 w-full h-full p-2">
          <div className={dotClass} />
          <div className={dotClass} />
          <div className={dotClass} />
          <div className={dotClass} />
        </div>
      ),
      5: (
        <div className="relative w-full h-full p-2">
          <div className="grid grid-cols-2 gap-2 w-full h-full">
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
            <div className={dotClass} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={dotClass} />
          </div>
        </div>
      ),
      6: (
        <div className="grid grid-cols-2 grid-rows-3 gap-1 w-full h-full p-2">
          <div className={dotClass} />
          <div className={dotClass} />
          <div className={dotClass} />
          <div className={dotClass} />
          <div className={dotClass} />
          <div className={dotClass} />
        </div>
      )
    };

    return dotPatterns[num as keyof typeof dotPatterns] || dotPatterns[1];
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-br from-gray-100 to-gray-200
        border-2 border-gray-300
        rounded-lg
        shadow-lg
        flex items-center justify-center
        transition-all duration-300
        ${isRolling ? 'animate-spin' : ''}
        ${className}
      `}
      style={{
        boxShadow: isRolling 
          ? '0 0 20px rgba(59, 130, 246, 0.5)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {isRolling ? (
        <div className="text-2xl">🎲</div>
      ) : (
        renderDots(value)
      )}
    </div>
  );
};