import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';

//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

// Your Firebase config - Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtDs_l6BkbII_W0uaBrnztmam865pIVY0",
  authDomain: "map-notes-283ad.firebaseapp.com",
  projectId: "map-notes-283ad",
  storageBucket: "map-notes-283ad.firebasestorage.app",
  messagingSenderId: "1080192390807",
  appId: "1:1080192390807:web:f5c5a8a576cf32d3f37bd2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
export default app;
