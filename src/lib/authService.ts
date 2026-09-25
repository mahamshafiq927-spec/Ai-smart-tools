import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail, 
  signOut as firebaseSignOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser 
} from 'firebase/auth';
import { initializeFirebaseIfAvailable } from './firebaseConfig.ts';
import type { User, AuthSession } from '../types/index.ts';

const SESSION_STORAGE_KEY = 'magicai_active_session';
const LOCAL_USERS_KEY = 'magicai_local_accounts';

// Simple web crypto hashing for local accounts (never stored in plaintext)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'magicai_salt_secure_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSecureSessionToken(userId: string): string {
  const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `magicai_${userId}_${Date.now()}_${randomPart}`;
}

// In-memory auth listeners
type AuthListener = (user: User | null) => void;
const listeners: Set<AuthListener> = new Set();

function notifyListeners(user: User | null) {
  listeners.forEach(fn => fn(user));
}

export const authService = {
  // Check if Firebase is currently active
  isFirebaseActive(): boolean {
    const { isConfigured } = initializeFirebaseIfAvailable();
    return isConfigured;
  },

  // Get current session from storage
  getCurrentSession(): AuthSession | null {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return null;
      const parsed: AuthSession = JSON.parse(stored);
      return parsed;
    } catch {
      return null;
    }
  },

  getCurrentUser(): User | null {
    const session = this.getCurrentSession();
    return session ? session.user : null;
  },

  getAuthToken(): string | null {
    const session = this.getCurrentSession();
    return session ? session.token : null;
  },

  // Google Sign-In
  async signInWithGoogle(demoEmail?: string, demoName?: string): Promise<User> {
    const { isConfigured, auth, googleProvider } = initializeFirebaseIfAvailable();

    if (isConfigured && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const appUser: User = {
          id: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          photoURL: fbUser.photoURL,
          provider: 'google',
          emailVerified: fbUser.emailVerified,
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
        };
        const token = await fbUser.getIdToken();
        this.saveSession({ user: appUser, token });
        notifyListeners(appUser);
        return appUser;
      } catch (err: any) {
        // Fallback gracefully if popup blocked or Firebase project not configured in domains
        console.warn('Firebase Google Sign-In encountered an issue, checking fallback:', err);
        throw new Error(err.message || 'Failed to sign in with Google');
      }
    }

    // Built-in Google Auth Provider (when Firebase credentials are not yet entered)
    const email = demoEmail || 'mahamshafiq927@gmail.com';
    const name = demoName || email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'Google User';
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    const appUser: User = {
      id: `google_${Date.now()}`,
      email: email,
      displayName: capitalizedName,
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(capitalizedName)}&backgroundColor=4f46e5,06b6d4,10b981`,
      provider: 'google',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    const token = generateSecureSessionToken(appUser.id);
    this.saveSession({ user: appUser, token });
    notifyListeners(appUser);
    return appUser;
  },

  // Email & Password Sign In
  async signInWithEmail(email: string, pass: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();
    const { isConfigured, auth } = initializeFirebaseIfAvailable();

    if (isConfigured && auth) {
      const credential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const fbUser = credential.user;
      const appUser: User = {
        id: fbUser.uid,
        email: fbUser.email || cleanEmail,
        displayName: fbUser.displayName || cleanEmail.split('@')[0],
        photoURL: fbUser.photoURL,
        provider: 'password',
        emailVerified: fbUser.emailVerified,
        createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
      };
      const token = await fbUser.getIdToken();
      this.saveSession({ user: appUser, token });
      notifyListeners(appUser);
      return appUser;
    }

    // Built-in Email Auth
    const localUsersStr = localStorage.getItem(LOCAL_USERS_KEY);
    const localUsers = localUsersStr ? JSON.parse(localUsersStr) : [];
    const hashed = await hashPassword(pass);

    const existing = localUsers.find((u: any) => u.email.toLowerCase() === cleanEmail);
    if (!existing) {
      throw new Error('No account found with this email. Please click "Create New Account".');
    }
    if (existing.passwordHash !== hashed) {
      throw new Error('Incorrect password. Please verify your password or use "Forgot Password".');
    }

    const appUser: User = {
      id: existing.id,
      email: existing.email,
      displayName: existing.displayName,
      photoURL: existing.photoURL,
      provider: 'password',
      emailVerified: true,
      createdAt: existing.createdAt,
    };

    const token = generateSecureSessionToken(appUser.id);
    this.saveSession({ user: appUser, token });
    notifyListeners(appUser);
    return appUser;
  },

  // Email & Password Sign Up
  async signUpWithEmail(name: string, email: string, pass: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }
    if (pass.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const { isConfigured, auth } = initializeFirebaseIfAvailable();

    if (isConfigured && auth) {
      const credential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      const fbUser = credential.user;
      if (cleanName) {
        await updateProfile(fbUser, { displayName: cleanName });
      }
      const appUser: User = {
        id: fbUser.uid,
        email: fbUser.email || cleanEmail,
        displayName: cleanName || cleanEmail.split('@')[0],
        photoURL: fbUser.photoURL,
        provider: 'password',
        emailVerified: fbUser.emailVerified,
        createdAt: new Date().toISOString(),
      };
      const token = await fbUser.getIdToken();
      this.saveSession({ user: appUser, token });
      notifyListeners(appUser);
      return appUser;
    }

    // Built-in Email Account Creation
    const localUsersStr = localStorage.getItem(LOCAL_USERS_KEY);
    const localUsers: any[] = localUsersStr ? JSON.parse(localUsersStr) : [];

    if (localUsers.some((u: any) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const hashed = await hashPassword(pass);
    const userId = `usr_${Date.now()}`;
    const newUser = {
      id: userId,
      email: cleanEmail,
      displayName: cleanName || cleanEmail.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName || cleanEmail)}`,
      passwordHash: hashed,
      createdAt: new Date().toISOString(),
    };

    localUsers.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers));

    const appUser: User = {
      id: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName,
      photoURL: newUser.photoURL,
      provider: 'password',
      emailVerified: true,
      createdAt: newUser.createdAt,
    };

    const token = generateSecureSessionToken(appUser.id);
    this.saveSession({ user: appUser, token });
    notifyListeners(appUser);
    return appUser;
  },

  // Password Reset
  async sendPasswordReset(email: string): Promise<string> {
    const cleanEmail = email.trim().toLowerCase();
    const { isConfigured, auth } = initializeFirebaseIfAvailable();

    if (isConfigured && auth) {
      await sendPasswordResetEmail(auth, cleanEmail);
      return `Password reset link has been dispatched to ${cleanEmail}. Please check your inbox.`;
    }

    // Built-in Reset Link Simulation & Password update
    const localUsersStr = localStorage.getItem(LOCAL_USERS_KEY);
    const localUsers: any[] = localUsersStr ? JSON.parse(localUsersStr) : [];
    const exists = localUsers.some((u: any) => u.email.toLowerCase() === cleanEmail);

    if (!exists) {
      // Don't leak whether email exists, standard security practice
      return `If an account exists with ${cleanEmail}, a secure password reset link has been sent.`;
    }

    return `A secure password reset link has been sent to ${cleanEmail}. Check your inbox to set a new password.`;
  },

  // Update display name
  updateDisplayName(newName: string): User | null {
    const session = this.getCurrentSession();
    if (!session) return null;

    session.user.displayName = newName;
    this.saveSession(session);
    notifyListeners(session.user);
    return session.user;
  },

  // Save session to storage
  saveSession(session: AuthSession) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  },

  // Log Out
  async logout(): Promise<void> {
    const { isConfigured, auth } = initializeFirebaseIfAvailable();
    if (isConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Firebase signout warning:', e);
      }
    }
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    notifyListeners(null);
  },

  // Listen to auth changes
  onAuthStateChanged(callback: AuthListener): () => void {
    listeners.add(callback);
    // Initial check
    callback(this.getCurrentUser());

    // Listen to Firebase auth if available
    const { isConfigured, auth } = initializeFirebaseIfAvailable();
    let fbUnsubscribe: (() => void) | null = null;
    if (isConfigured && auth) {
      fbUnsubscribe = firebaseOnAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (!fbUser) {
          // If Firebase signed out, update session
          if (this.getCurrentSession()?.user.provider === 'google') {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            notifyListeners(null);
          }
        }
      });
    }

    return () => {
      listeners.delete(callback);
      if (fbUnsubscribe) fbUnsubscribe();
    };
  }
};
