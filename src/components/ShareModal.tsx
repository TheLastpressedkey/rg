import React, { useState } from 'react';
import { X, Copy, Check, Link2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, documentId }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}?dashboard=${documentId}`;

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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Link2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Partager le dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-300 mb-4">
            Partagez ce lien pour permettre à d'autres personnes d'accéder au dashboard en temps réel.
          </p>

          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copied ? (
                <div className="flex items-center space-x-1">
                  <Check className="w-4 h-4" />
                  <span>Copié!</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Copy className="w-4 h-4" />
                  <span>Copier</span>
                </div>
              )}
            </button>
          </div>

          <div className="bg-blue-900 bg-opacity-50 border border-blue-700 rounded-md p-3">
            <p className="text-xs text-blue-300">
              <strong>Info:</strong> Toute personne ayant ce lien pourra accéder au dashboard. 
              Assurez-vous de ne le partager qu'avec des personnes autorisées.
            </p>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};