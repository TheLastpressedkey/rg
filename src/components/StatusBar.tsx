import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Share2, 
  Wifi, 
  Copy, 
  HelpCircle, 
  Zap, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';
import { ShareModal } from './ShareModal';

interface StatusBarProps {
  user: User;
  currentTime: Date;
  onUserChange: (user: User) => void;
  onClearAllZones?: () => void;
  hasActiveZones?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  user, 
  currentTime, 
  onUserChange,
  onClearAllZones,
  hasActiveZones = false
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState(user.name);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleNameSubmit = () => {
    onUserChange({ ...user, name: userName });
    setIsEditingName(false);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
    if (e.key === 'Escape') {
      setUserName(user.name);
      setIsEditingName(false);
    }
  };

  const handleClearAllZones = () => {
    if (hasActiveZones && onClearAllZones) {
      onClearAllZones();
    }
  };

  return (
    <>
      <div className="h-12 bg-gray-800 border-t border-gray-700 flex items-center justify-center">
        {/* Centered compact status bar */}
        <div className="flex items-center space-x-4 bg-gray-800 px-6 py-2 rounded-lg">
          {/* User section */}
          <div className="flex items-center space-x-2">
            <UserIcon className="w-4 h-4 text-gray-400" />
            {isEditingName ? (
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={handleNameKeyPress}
                className="bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none w-20"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-white text-sm hover:text-blue-400 transition-colors"
              >
                {user.name}
              </button>
            )}
          </div>

          {/* Share button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>

          {/* Navigation arrows */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Time and Date */}
          <div className="flex items-center space-x-2 text-white">
            <span className="text-sm font-mono">
              {formatTime(currentTime)}
            </span>
            <span className="text-gray-500">-</span>
            <span className="text-sm">
              {formatDate(currentTime)}
            </span>
          </div>

          <button className="text-gray-400 hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Progress bar placeholder */}
          <div className="w-24 h-1 bg-gray-700 rounded-full">
            <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
          </div>

          {/* Status icons */}
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors cursor-pointer" />
            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-white transition-colors cursor-pointer" />
            
            {/* Clear All Zones Button (Lightning Icon) */}
            <button
              onClick={handleClearAllZones}
              disabled={!hasActiveZones}
              className={`
                w-4 h-4 transition-all duration-200 cursor-pointer
                ${hasActiveZones 
                  ? 'text-yellow-400 hover:text-yellow-300 hover:scale-110 drop-shadow-lg' 
                  : 'text-gray-600 cursor-not-allowed'
                }
              `}
              title={hasActiveZones ? 'Vider toutes les zones' : 'Aucune zone active'}
            >
              <Zap className="w-4 h-4" />
            </button>
            
            <Settings className="w-4 h-4 text-gray-400 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        documentId="dashboard"
      />
    </>
  );
};