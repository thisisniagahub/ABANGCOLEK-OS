/**
 * Safe Firebase Config Loader for ABANGCOLEK-OS
 * Resilient against missing or unmounted firebase-applet-config.json
 */

export { firebaseConfig, type FirebaseAppletConfig } from './googleAuth';
import { firebaseConfig } from './googleAuth';
export default firebaseConfig;
