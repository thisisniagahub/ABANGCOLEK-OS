/**
 * Safe Firebase Config Loader for ABANGCOLEK-OS
 * Resilient against missing or unmounted firebase-applet-config.json
 */

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

const DEFAULT_FIREBASE_CONFIG: FirebaseAppletConfig = {
  projectId: "jumping-welder-fw1xt",
  appId: "1:362107811694:web:bc38952304f3a09821737f",
  apiKey: "AIzaSyCu_3SqDFo3dO1Rw1xHuPGqx-Z5MmQcJuY",
  authDomain: "jumping-welder-fw1xt.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-remixabangcoleko-fdbc0ab3-bf88-4d43-9836-e87a41417dea",
  storageBucket: "jumping-welder-fw1xt.firebasestorage.app",
  messagingSenderId: "362107811694",
  measurementId: "",
  oAuthClientId: "362107811694-ce2lg146uok385hug9fs122agrumtblh.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

let loadedConfig = DEFAULT_FIREBASE_CONFIG;

try {
  // Safe glob that does not break Vite build if the file is absent
  const modules = import.meta.glob<Record<string, any>>('../../firebase-applet-config.json', { eager: true });
  const key = Object.keys(modules)[0];
  if (key && modules[key]?.default) {
    loadedConfig = modules[key].default as FirebaseAppletConfig;
  }
} catch (e) {
  console.warn('Could not load external firebase-applet-config.json, using default fallback', e);
}

export const firebaseConfig = loadedConfig;
export default firebaseConfig;
