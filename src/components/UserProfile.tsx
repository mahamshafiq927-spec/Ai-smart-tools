import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Key, 
  LogOut, 
  Edit3, 
  Check, 
  Settings,
  Database
} from 'lucide-react';
import type { User } from '../types/index.ts';
import { authService } from '../lib/authService.ts';

interface UserProfileProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  savedCount: number;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isOpen,
  onClose,
  onLogout,
  savedCount,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [customFirebaseKey, setCustomFirebaseKey] = useState('');
  const [customProjectId, setCustomProjectId] = useState('');
  const [firebaseSaved, setFirebaseSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveName = () => {
    if (displayName.trim()) {
      authService.updateDisplayName(displayName.trim());
      setIsEditing(false);
    }
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (customFirebaseKey && customProjectId) {
      localStorage.setItem('magicai_custom_firebase_config', JSON.stringify({
        apiKey: customFirebaseKey.trim(),
        projectId: customProjectId.trim(),
        authDomain: `${customProjectId.trim()}.firebaseapp.com`,
        appId: '1:magicai:web:config'
      }));
      setFirebaseSaved(true);
      setTimeout(() => setFirebaseSaved(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-800">
          <div className="relative">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-600/20">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-semibold text-emerald-400 flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Active
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="bg-slate-950 border border-indigo-500 rounded-lg px-2.5 py-1 text-base font-semibold text-white focus:outline-none"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {user.displayName}
                  </h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mb-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{user.email}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {user.provider === 'google' ? 'Google Authenticated' : 'Email & Password'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* User Stats & Information */}
        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">
              Saved Outputs
            </span>
            <span className="text-2xl font-bold text-white">{savedCount}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Creations in your library</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">
              Member Since
            </span>
            <span className="text-sm font-semibold text-slate-200 mt-1 block">
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="text-[10px] text-emerald-400 block mt-1">Unlimited Free Tier</span>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2.5 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Security Architecture Status</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gemini API Key Location:</span>
            <span className="text-emerald-400 font-medium">Server-Side Proxy (Hidden)</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Client Authentication:</span>
            <span className="text-emerald-400 font-medium">Bearer Session Tokens</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Password Storage:</span>
            <span className="text-emerald-400 font-medium">Salted SHA-256 / Scrypt Hashing</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Done
          </button>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of MagicAI</span>
          </button>
        </div>

      </div>
    </div>
  );
};
