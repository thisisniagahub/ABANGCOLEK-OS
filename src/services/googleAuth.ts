/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut as fbSignOut,
  User 
} from 'firebase/auth';

export interface FirebaseAppletConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId?: string;
  oAuthClientId?: string;
  recaptchaSiteKey?: string;
}

// 1. Secure object fallback from environment variables or project defaults
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : ({} as Record<string, any>);

const fallbackFirebaseConfig: FirebaseAppletConfig = {
  projectId: env.VITE_FIREBASE_PROJECT_ID || "jumping-welder-fw1xt",
  appId: env.VITE_FIREBASE_APP_ID || "1:362107811694:web:bc38952304f3a09821737f",
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyCu_3SqDFo3dO1Rw1xHuPGqx-Z5MmQcJuY",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${env.VITE_FIREBASE_PROJECT_ID || "jumping-welder-fw1xt"}.firebaseapp.com`,
  firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || "ai-studio-remixabangcoleko-fdbc0ab3-bf88-4d43-9836-e87a41417dea",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${env.VITE_FIREBASE_PROJECT_ID || "jumping-welder-fw1xt"}.firebasestorage.app`,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "362107811694",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "",
  oAuthClientId: env.VITE_FIREBASE_OAUTH_CLIENT_ID || "362107811694-ce2lg146uok385hug9fs122agrumtblh.apps.googleusercontent.com",
  recaptchaSiteKey: env.VITE_FIREBASE_RECAPTCHA_SITE_KEY || ""
};

// 2. Safely attempt to import the local config file directly if it exists in the project root
let rootConfig: Partial<FirebaseAppletConfig> = {};
try {
  // Vite root-level glob directly checking for config in project root without fragile relative paths
  const rootConfigs = import.meta.glob<Record<string, any>>('/firebase-applet-config.json', { eager: true });
  const rootKey = Object.keys(rootConfigs)[0];
  if (rootKey && rootConfigs[rootKey]) {
    rootConfig = (rootConfigs[rootKey].default || rootConfigs[rootKey]) as Partial<FirebaseAppletConfig>;
  }
} catch {
  // Fallback cleanly if absent
}

export const firebaseConfig: FirebaseAppletConfig = {
  ...fallbackFirebaseConfig,
  ...rootConfig
};

export const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.body.readonly',
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
  'https://www.googleapis.com/auth/gmail.addons.current.message.action',
  'https://www.googleapis.com/auth/gmail.addons.current.message.metadata',
  'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.insert',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.metadata',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.settings.basic',
  'https://www.googleapis.com/auth/gmail.settings.sharing',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/meetings.space.created',
  'https://www.googleapis.com/auth/meetings.space.readonly',
  'https://www.googleapis.com/auth/chat.spaces',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/chat.messages',
  'https://www.googleapis.com/auth/chat.messages.create',
  'https://www.googleapis.com/auth/chat.messages.readonly',
];

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => {
  provider.addScope(scope);
});
provider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline',
});

// Flag to indicate if we are in the middle of a sign-in flow.
let isSigningIn = false;
// Cache the access token in memory. Never store in localStorage or sessionStorage.
let cachedAccessToken: string | null = null;

// Auth state listeners
type AuthListener = (user: User | null, token: string | null) => void;
const listeners: Set<AuthListener> = new Set();

export const subscribeAuth = (listener: AuthListener) => {
  listeners.add(listener);
  listener(auth.currentUser, cachedAccessToken);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = (user: User | null, token: string | null) => {
  listeners.forEach(l => l(user, token));
};

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        notifyListeners(user, cachedAccessToken);
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        notifyListeners(user, null);
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      notifyListeners(null, null);
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Must be called from a button click or user interaction
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    notifyListeners(result.user, cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await fbSignOut(auth);
  cachedAccessToken = null;
  notifyListeners(null, null);
};
