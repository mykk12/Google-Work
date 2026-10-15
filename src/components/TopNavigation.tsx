import { useState } from 'react';
import { ScreenId } from '../types';
import { ReactiveGlassBlock } from './ReactiveGlassBlock';
import { useAuth } from '../context/AuthContext.tsx';
import { FolderHeart, LogIn, LogOut, User as UserIcon, Database } from 'lucide-react';
import { SUPABASE_PROJECT_ID } from '../lib/supabase.ts';

interface TopNavigationProps {
  currentScreen?: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onPrimaryAction: () => void;
  onOpenSaved?: () => void;
  onOpenSupabaseConfig?: () => void;
}

export function TopNavigation({
  onNavigate,
  onPrimaryAction,
  onOpenSaved,
  onOpenSupabaseConfig,
}: TopNavigationProps) {
  const { user, signInWithGoogle, signOutUser, connectionInfo } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

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

          {/* Zone 2: Supabase connection indicator */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Supabase backend status pill */}
            <button
              onClick={onOpenSupabaseConfig}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono-code text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/25 rounded-xl transition-all cursor-pointer"
              title={`Supabase Backend: ${SUPABASE_PROJECT_ID} (Click to inspect / SQL setup)`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-sans text-neutral-300">Supabase</span>
              <span className="hidden lg:inline text-[11px] text-emerald-400 font-mono-code">
                {SUPABASE_PROJECT_ID.slice(0, 8)}...
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* Saved Designs Button */}
            <button
              onClick={onOpenSaved}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
              title="View designs stored in Supabase"
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
                        Connected to Supabase
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
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenSupabaseConfig?.();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                    >
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span>Supabase Settings & SQL</span>
                    </button>
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
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-neutral-300" />
                <span className="hidden sm:inline">Sign In</span>
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
    </header>
  );
}
