import React, { useState } from 'react';
import { Users, Play, Link2, Copy, Check, UserPlus, Gamepad2, Shield, Zap } from 'lucide-react';

interface SetupScreenProps {
  onCreateGame: (userName: string) => void;
  onJoinGame: (userName: string, gameId: string) => void;
  gameId?: string; // If provided, user is joining an existing game
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ 
  onCreateGame, 
  onJoinGame, 
  gameId 
}) => {
  const [userName, setUserName] = useState('');
  const [createdGameId, setCreatedGameId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isJoiningGame = !!gameId;

  const generateGameId = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleCreateGame = async () => {
    if (!userName.trim()) return;
    
    setIsLoading(true);
    
    // Simulate game creation
    setTimeout(() => {
      const newGameId = generateGameId();
      const url = `${window.location.origin}?game=${newGameId}`;
      
      setCreatedGameId(newGameId);
      setShareUrl(url);
      setIsLoading(false);
    }, 1000);
  };

  const handleJoinGame = () => {
    if (!userName.trim() || !gameId) return;
    
    setIsLoading(true);
    
    // Simulate joining game
    setTimeout(() => {
      onJoinGame(userName.trim(), gameId);
    }, 500);
  };

  const handleStartGame = () => {
    if (!userName.trim() || !createdGameId) return;
    onCreateGame(userName.trim());
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-32 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          
          {/* Header */}
          <div className="relative p-8 text-center">
            {/* Logo/Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <Gamepad2 className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Risk<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Games</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-slate-300 text-sm leading-relaxed">
              {isJoiningGame 
                ? 'Rejoignez la partie et commencez à jouer'
                : 'Créez votre partie et invitez vos amis'
              }
            </p>
            
            {/* Features Pills */}
            <div className="flex justify-center space-x-2 mt-4">
              <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-xs text-slate-300">Sécurisé</span>
              </div>
              <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1">
                <Users className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-slate-300">Multijoueur</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            
            {/* User Name Input */}
            <div className="mb-6">
              <label htmlFor="userName" className="block text-sm font-medium text-slate-300 mb-3">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Entrez votre nom..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-200 backdrop-blur-sm"
                  maxLength={20}
                  disabled={isLoading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>

            {/* Game ID Display (for joining) */}
            {isJoiningGame && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  ID de la partie
                </label>
                <div className="px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl text-white font-mono text-center backdrop-blur-sm">
                  {gameId}
                </div>
              </div>
            )}

            {/* Share URL Display (after creating) */}
            {createdGameId && shareUrl && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Lien de partage
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:border-purple-400 focus:outline-none backdrop-blur-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      copied
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                        : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                    }`}
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Partagez ce lien avec vos amis
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!createdGameId && !isJoiningGame && (
                <button
                  onClick={handleCreateGame}
                  disabled={!userName.trim() || isLoading}
                  className={`
                    w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 transform
                    ${!userName.trim() || isLoading
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Création...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Créer une partie</span>
                    </div>
                  )}
                </button>
              )}

              {createdGameId && (
                <button
                  onClick={handleStartGame}
                  disabled={!userName.trim()}
                  className={`
                    w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 transform
                    ${!userName.trim()
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Commencer la partie</span>
                  </div>
                </button>
              )}

              {isJoiningGame && (
                <button
                  onClick={handleJoinGame}
                  disabled={!userName.trim() || isLoading}
                  className={`
                    w-full py-3 px-4 rounded-xl font-medium transition-300 transform
                    ${!userName.trim() || isLoading
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Rejoindre la partie</span>
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium text-sm mb-2">Comment jouer ?</h3>
              <ul className="space-y-1 text-xs text-slate-400">
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  <span>Créez une partie et partagez le lien</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  <span>Vos amis rejoignent avec le lien</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span>Jouez ensemble en temps réel</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Powered by <span className="text-slate-400 font-medium">Sopra Steria</span>
          </p>
        </div>
      </div>
    </div>
  );
};