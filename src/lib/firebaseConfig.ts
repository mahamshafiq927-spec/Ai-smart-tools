import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  type Auth 
} from 'firebase/auth';

// Reads Firebase configuration from Vite environment variables or localStorage
export interface FirebaseConfigObject {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

export function getStoredFirebaseConfig(): FirebaseConfigObject | null {
  // 1. First check environment variables (Vite env)
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;

  if (envApiKey && envProjectId && envAppId) {
    return {
      apiKey: envApiKey,
      authDomain: envAuthDomain || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: envAppId,
    };
  }

  // 2. Check localStorage if user pasted config in settings
  try {
    const saved = localStorage.getItem('magicai_custom_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read custom Firebase config from localStorage:', e);
  }

  return null;
}

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let googleAuthProviderInstance: GoogleAuthProvider | null = null;

export function initializeFirebaseIfAvailable(): {
  isConfigured: boolean;
  app: FirebaseApp | null;
  auth: Auth | null;
  googleProvider: GoogleAuthProvider | null;
} {
  const config = getStoredFirebaseConfig();

  if (!config || !config.apiKey || config.apiKey === 'YOUR_FIREBASE_API_KEY') {
    return {
      isConfigured: false,
      app: null,
      auth: null,
      googleProvider: null,
    };
  }

  try {
    if (!firebaseAppInstance) {
      const existingApps = getApps();
      if (existingApps.length > 0) {
        firebaseAppInstance = existingApps[0];
      } else {
        firebaseAppInstance = initializeApp(config);
      }
      firebaseAuthInstance = getAuth(firebaseAppInstance);
      googleAuthProviderInstance = new GoogleAuthProvider();
      googleAuthProviderInstance.setCustomParameters({
        prompt: 'select_account',
      });
    }

    return {
      isConfigured: true,
      app: firebaseAppInstance,
      auth: firebaseAuthInstance,
      googleProvider: googleAuthProviderInstance,
    };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return {
      isConfigured: false,
      app: null,
      auth: null,
      googleProvider: null,
    };
  }
}
