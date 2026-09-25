import React from 'react';
import { 
  Sparkles, 
  User as UserIcon, 
  LogOut, 
  BookOpen, 
  Bookmark, 
  ShieldCheck, 
  Menu, 
  X,
  LogIn
} from 'lucide-react';
import type { User } from '../types/index.ts';

interface NavbarProps {
  user: User | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenProfile: () => void;
  onOpenSaved: () => void;
  onOpenGuide: () => void;
  onSelectCategory: (cat: string) => void;
  activeCategory: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenProfile,
  onOpenSaved,
  onOpenGuide,
  onSelectCategory,
  activeCategory,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onSelectCategory('All')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  MagicAI
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  Free Tools
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Smart AI Productivity Suite</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              onSelectCategory('All');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeCategory === 'All' 
                ? 'bg-slate-800 text-white font-semibold' 
                : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            All AI Tools
          </button>

          <button
            onClick={onOpenSaved}
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-indigo-400" />
            <span>Saved Outputs</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Setup & Deploy Guide</span>
          </button>
        </nav>

        {/* Right Action: Auth or Profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800 transition-all text-left group"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate max-w-[120px]">
                    {user.displayName}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {user.provider === 'google' ? 'Google' : 'Email'}
                  </div>
                </div>
              </button>

              <button
                onClick={onLogout}
                title="Log Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => {
                onSelectCategory('All');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800"
            >
              All AI Tools
            </button>
            <button
              onClick={() => {
                onOpenSaved();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
            >
              <Bookmark className="w-4 h-4 text-indigo-400" />
              Saved Outputs
            </button>
            <button
              onClick={() => {
                onOpenGuide();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Firebase & Vercel Guide
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
