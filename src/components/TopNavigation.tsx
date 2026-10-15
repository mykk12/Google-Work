import { useState, useEffect } from 'react';
import { ScreenId } from '../types';
import { ReactiveGlassBlock } from './ReactiveGlassBlock';
import { useAuth } from '../context/AuthContext.tsx';
import { FolderHeart, LogIn, LogOut, User as UserIcon, Database } from 'lucide-react';

import { AuthModal } from './AuthModal';

interface TopNavigationProps {
  currentScreen?: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onPrimaryAction: () => void;
  onOpenSaved?: () => void;
  onOpenSupabaseConfig?: () => void;
  onToast?: (message: string) => void;
}

export function TopNavigation({
  onNavigate,
  onPrimaryAction,
  onOpenSaved,
  onOpenSupabaseConfig,
  onToast,
}: TopNavigationProps) {
  const { user, signOutUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Disabled for end users by default; visible only if admin mode is activated (?admin=true in URL or localStorage)
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return (
      params.get('admin') === 'true' ||
      params.get('dev') === 'true' ||
      localStorage.getItem('supabase_admin') === 'true'
    );
  });

  // Developer hotkey (Ctrl/Cmd + Shift + S) to toggle admin controls if needed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setIsAdmin((prev) => {
          const next = !prev;
          localStorage.setItem('supabase_admin', next ? 'true' : 'false');
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 pt-3 pb-2 transition-all">
      {/* Target Element: div#root > div > header > div with reactive reflection */}
      <ReactiveGlassBlock
        variant="ultra"
        className="max-w-7xl mx-auto rounded-2xl shadow-2xl"
        glowColor="rgba(195, 225, 255, 0.4)"
      >
        <div className="flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 py-3">
          {/* Zone 1: Wordmark */}
          <button
            onClick={() => onNavigate('showcase')}
            className="text-lg font-display font-bold tracking-tight text-neutral-100 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            <span>Aethel Studio</span>
          </button>

          {/* Zone 2: Navigation controls & actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Saved Designs Button */}
            <button
              onClick={onOpenSaved}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
              title="View saved designs"
            >
              <FolderHeart className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">Saved Designs</span>
            </button>

            {/* Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-neutral-200 cursor-pointer transition-all"
                >
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.displayName || 'User'}
                      className="w-5 h-5 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-[10px]">
                      <UserIcon className="w-3 h-3" />
                    </div>
                  )}
                  <span className="max-w-[90px] truncate hidden md:inline">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-surface border border-white/20 shadow-2xl p-2 z-50 text-xs backdrop-blur-2xl">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <div className="font-semibold text-white truncate">{user.displayName || 'User'}</div>
                      <div className="text-[11px] text-neutral-400 truncate">{user.email}</div>
                      <div className="text-[10px] text-emerald-400 uppercase font-mono-code mt-0.5">
                        Connected
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenSaved?.();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                    >
                      <FolderHeart className="w-4 h-4 text-emerald-400" />
                      <span>My Saved Designs</span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenSupabaseConfig?.();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                      >
                        <Database className="w-4 h-4 text-emerald-400" />
                        <span>Settings & SQL</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOutUser();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-300 hover:text-red-200 hover:bg-red-500/10 text-left transition-colors cursor-pointer mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="group relative flex items-center gap-2 px-3 sm:px-3.5 py-1.5 text-xs font-medium text-neutral-100 hover:text-white bg-gradient-to-r from-blue-500/15 via-white/10 to-indigo-500/15 hover:from-blue-500/25 hover:via-white/15 hover:to-indigo-500/25 border border-white/20 hover:border-white/35 rounded-xl transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.2)] active:scale-95"
                title="Sign In with Google or Email & Password"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-300 group-hover:text-blue-200 transition-colors" />
                <span>Sign In</span>
              </button>
            )}

            {/* Launch Studio Action */}
            <button
              onClick={onPrimaryAction}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-neutral-950 bg-white/95 hover:bg-white active:bg-neutral-200 transition-all rounded-xl whitespace-nowrap shrink-0 cursor-pointer shadow-[0_4px_16px_rgba(255,255,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)]"
            >
              Studio
            </button>
          </div>
        </div>
      </ReactiveGlassBlock>

      {/* Google API & Email/Password Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(msg) => onToast?.(msg)}
      />
    </header>
  );
}
