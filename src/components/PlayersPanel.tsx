import React from 'react';
import { Users, Crown, Wifi, WifiOff } from 'lucide-react';
import { User } from '../types';

interface PlayersPanelProps {
  players: User[];
  currentUserId: string;
  isConnected: boolean;
  gameId?: string;
}

export const PlayersPanel: React.FC<PlayersPanelProps> = ({ 
  players, 
  currentUserId, 
  isConnected,
  gameId 
}) => {
  const totalPlayers = players.length;

  const formatLastSeen = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 30000) return 'En ligne';
    if (diff < 60000) return '1min';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    return `${Math.floor(diff / 3600000)}h`;
  };

  return (
    <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg border border-gray-700 p-3 shadow-lg max-w-xs">
      
      {/* Header compact */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium text-sm">Joueurs</span>
          <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
            {totalPlayers}
          </span>
        </div>
        
        {/* Connection Status compact */}
        <div className="flex items-center">
          {isConnected ? (
            <Wifi className="w-3 h-3 text-green-400" title="Connecté" />
          ) : (
            <WifiOff className="w-3 h-3 text-red-400" title="Déconnecté" />
          )}
        </div>
      </div>

      {/* Game ID compact */}
      {gameId && (
        <div className="mb-3 p-2 bg-gray-700 bg-opacity-50 rounded border border-gray-600">
          <div className="text-xs text-gray-400">ID: <span className="text-white font-mono">{gameId}</span></div>
        </div>
      )}

      {/* Players List compact */}
      <div className="space-y-1.5 max-h-24 overflow-y-auto">
        {players.length === 0 ? (
          <div className="text-center py-2">
            <div className="text-gray-400 text-xs">Aucun joueur</div>
          </div>
        ) : (
          players.map((player, index) => {
            const isCurrentUser = player.id === currentUserId;
            const isHost = index === 0;
            
            return (
              <div
                key={player.id}
                className={`
                  flex items-center justify-between p-1.5 rounded transition-all duration-200
                  ${isCurrentUser 
                    ? 'bg-blue-600 bg-opacity-30 border border-blue-500 border-opacity-50' 
                    : 'bg-gray-700 bg-opacity-30 hover:bg-opacity-50'
                  }
                `}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {/* Player Avatar compact */}
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Player Info compact */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs font-medium truncate ${isCurrentUser ? 'text-white' : 'text-gray-200'}`}>
                        {player.name}
                        {isCurrentUser && ' (Vous)'}
                      </span>
                      
                      {/* Host Crown */}
                      {isHost && (
                        <Crown className="w-2.5 h-2.5 text-yellow-400 flex-shrink-0" title="Hôte" />
                      )}
                    </div>
                    
                    {/* Last Seen compact */}
                    <div className={`text-xs ${isCurrentUser ? 'text-blue-200' : 'text-gray-400'}`}>
                      {formatLastSeen(player.lastSeen)}
                    </div>
                  </div>
                </div>

                {/* Connection Indicator */}
                <div className="flex items-center ml-1">
                  <div 
                    className={`w-1.5 h-1.5 rounded-full ${
                      Date.now() - player.lastSeen < 30000 
                        ? 'bg-green-400' 
                        : 'bg-gray-500'
                    }`}
                    title={Date.now() - player.lastSeen < 30000 ? 'En ligne' : 'Hors ligne'}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info compact */}
      {players.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            {players.filter(p => Date.now() - p.lastSeen < 30000).length} actif(s)
          </div>
        </div>
      )}
    </div>
  );
};