import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock_api_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock_auth_domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock_project_id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mock_storage_bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "mock_sender_id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "mock_app_id"
};

let app, auth, googleProvider;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  
  // Add Calendar scope for Google Calendar Integration
  googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
  
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    console.log("Firebase initialized successfully.");
  } else {
    console.warn("WARNING: Firebase config not found in .env. Using mock configuration. Auth will likely fail.");
  }
} catch (error) {
  console.error("Firebase initialization error", error);
}

export { auth, googleProvider };
