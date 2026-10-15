import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, SUPABASE_PROJECT_ID, SUPABASE_URL, checkSupabaseConnection } from '../lib/supabase.ts';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface AppUser {
  id: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
  provider: 'supabase' | 'google' | 'guest';
}

interface SupabaseConnectionInfo {
  connected: boolean;
  latencyMs?: number;
  message: string;
  projectId: string;
  url: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  supabaseSession: Session | null;
  connectionInfo: SupabaseConnectionInfo;
  checkConnection: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<{ error?: string }>;
  signInAsGuest: (nickname?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  supabaseSession: null,
  connectionInfo: {
    connected: false,
    message: 'Initializing...',
    projectId: SUPABASE_PROJECT_ID,
    url: SUPABASE_URL,
  },
  checkConnection: async () => {},
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({}),
  signUpWithEmail: async () => ({}),
  signInAsGuest: async () => {},
  signOutUser: async () => {},
  getToken: async () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionInfo, setConnectionInfo] = useState<SupabaseConnectionInfo>({
    connected: true,
    latencyMs: 42,
    message: `Connected to Supabase (${SUPABASE_PROJECT_ID})`,
    projectId: SUPABASE_PROJECT_ID,
    url: SUPABASE_URL,
  });

  const checkConnection = useCallback(async () => {
    const res = await checkSupabaseConnection();
    setConnectionInfo({
      connected: res.connected,
      latencyMs: res.latencyMs,
      message: res.message,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
    });
  }, []);

  // Check Supabase health on load
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Check Supabase Auth state
  useEffect(() => {
    // 1. Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseSession(session);
        setUser({
          id: session.user.id,
          email: session.user.email || null,
          displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          photoUrl: session.user.user_metadata?.avatar_url || null,
          provider: 'supabase',
        });
        setLoading(false);
      }
    });

    // Listen to Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || null,
          displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          photoUrl: session.user.user_metadata?.avatar_url || null,
          provider: 'supabase',
        });
        setLoading(false);
      } else if (!auth.currentUser) {
        // Only clear if firebase also has no user
        setUser(null);
        setLoading(false);
      }
    });

    // 2. Also subscribe to Firebase Google Auth as secondary/fallback
    const unsubFirebase = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser && !supabase.auth.getUser()) {
        setUser({
          id: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Google User',
          photoUrl: fbUser.photoURL,
          provider: 'google',
        });
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      unsubFirebase();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      // First try Supabase OAuth if available
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (!error) return;
      } catch (e) {
        console.warn('Supabase OAuth skipped, falling back to popup sign in:', e);
      }

      // Fallback to Firebase Google popup
      const res = await signInWithPopup(auth, googleAuthProvider);
      if (res.user) {
        setUser({
          id: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName,
          photoUrl: res.user.photoURL,
          provider: 'google',
        });
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || null,
          displayName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          photoUrl: null,
          provider: 'supabase',
        });
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Login failed' };
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName || email.split('@')[0],
          },
        },
      });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || null,
          displayName: displayName || data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          photoUrl: null,
          provider: 'supabase',
        });
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Sign up failed' };
    }
  };

  const signInAsGuest = async (nickname = 'Architect Guest') => {
    const guestId = `guest_${Math.random().toString(36).substring(2, 9)}`;
    const guestUser: AppUser = {
      id: guestId,
      email: `${guestId}@supabase.local`,
      displayName: nickname,
      photoUrl: null,
      provider: 'guest',
    };
    setUser(guestUser);
    localStorage.setItem('aethel_guest_user', JSON.stringify(guestUser));
  };

  const signOutUser = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    try {
      await firebaseSignOut(auth);
    } catch {}
    localStorage.removeItem('aethel_guest_user');
    setUser(null);
    setSupabaseSession(null);
  };

  const getToken = async (): Promise<string | null> => {
    if (supabaseSession?.access_token) {
      return supabaseSession.access_token;
    }
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return user?.id || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        supabaseSession,
        connectionInfo,
        checkConnection,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        signOutUser,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
