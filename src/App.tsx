/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { ToolGrid } from './components/ToolGrid.tsx';
import { ToolWorkspace } from './components/ToolWorkspace.tsx';
import { AuthModal, type AuthMode } from './components/AuthModal.tsx';
import { UserProfile } from './components/UserProfile.tsx';
import { SavedCreationsModal } from './components/SavedCreationsModal.tsx';
import { DeploymentGuide } from './components/DeploymentGuide.tsx';
import { authService } from './lib/authService.ts';
import { TOOLS_DATA } from './lib/toolsData.ts';
import type { User, ToolDefinition, SavedCreation } from './types/index.ts';
import { ArrowLeft, Sparkles, BookOpen, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolDefinition | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Saved creations library
  const [savedCreations, setSavedCreations] = useState<SavedCreation[]>(() => {
    try {
      const stored = localStorage.getItem('magicai_saved_creations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Track Auth state
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setAuthInitialized(true);
      // If user logs in while modal is open, close modal
      if (currentUser) {
        setIsAuthModalOpen(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Save creations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('magicai_saved_creations', JSON.stringify(savedCreations));
    } catch (e) {
      console.warn('Could not save creations to localStorage', e);
    }
  }, [savedCreations]);

  const handleOpenAuth = (mode: AuthMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setIsProfileOpen(false);
  };

  const handleSelectTool = (tool: ToolDefinition) => {
    if (!user) {
      // Require authentication
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      setSelectedTool(tool);
    } else {
      setSelectedTool(tool);
    }
  };

  const handleSaveCreation = (creation: Omit<SavedCreation, 'id' | 'createdAt'>) => {
    const newRecord: SavedCreation = {
      ...creation,
      id: `save_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSavedCreations(prev => [newRecord, ...prev]);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedCreations(prev => prev.filter(item => item.id !== id));
  };

  // Filter saved creations for current user
  const userSavedCreations = savedCreations.filter(item => !user || item.userId === user.id);

  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center animate-spin mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold">Initializing MagicAI...</p>
      </div>
    );
  }

  // If user is not authenticated on initial load, show full-page auth screen as requested
  if (!user && !selectedTool && isAuthModalOpen) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
        <Navbar
          user={null}
          onOpenAuth={handleOpenAuth}
          onOpenProfile={() => {}}
          onOpenSaved={() => setIsSavedOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          onSelectCategory={setActiveCategory}
          activeCategory={activeCategory}
          onLogout={handleLogout}
        />

        <main className="flex-1 flex items-center justify-center p-4">
          <AuthModal
            isOpen={true}
            isFullPage={true}
            initialMode={authModalMode}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={loggedUser => {
              setUser(loggedUser);
              setIsAuthModalOpen(false);
            }}
          />
        </main>

        {isGuideOpen && (
          <DeploymentGuide
            isOpen={isGuideOpen}
            onClose={() => setIsGuideOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        user={user}
        onOpenAuth={handleOpenAuth}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onSelectCategory={cat => {
          setSelectedTool(null);
          setActiveCategory(cat);
        }}
        activeCategory={activeCategory}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* If a tool is active, render its workspace */}
        {selectedTool ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setSelectedTool(null)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to All AI Tools</span>
              </button>

              <button
                onClick={() => setIsGuideOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>10-Step Setup Guide</span>
              </button>
            </div>

            <ToolWorkspace
              tool={selectedTool}
              user={user}
              onOpenAuth={handleOpenAuth}
              onSaveCreation={handleSaveCreation}
            />
          </div>
        ) : (
          /* Otherwise render the Dashboard Tool Directory */
          <ToolGrid
            onSelectTool={handleSelectTool}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            user={user}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/60 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">MagicAI</span>
            <span>•</span>
            <span>Free AI Smart Tools Platform</span>
            <span>•</span>
            <span className="text-emerald-500 font-medium">Server-Side Gemini 2.5 Flash Proxy</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Firebase & Vercel Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSavedOpen(true)}
              className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Saved Library ({userSavedCreations.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={loggedUser => {
          setUser(loggedUser);
          setIsAuthModalOpen(false);
        }}
      />

      {/* User Profile Modal */}
      {user && (
        <UserProfile
          user={user}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onLogout={handleLogout}
          savedCount={userSavedCreations.length}
        />
      )}

      {/* Saved Creations Modal */}
      <SavedCreationsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedList={userSavedCreations}
        onDelete={handleDeleteSaved}
      />

      {/* 10-Step Setup & Deployment Guide Modal */}
      <DeploymentGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}
