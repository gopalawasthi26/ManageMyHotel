import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq",
  authDomain: "hotel-management-xxxxx.firebaseapp.com",
  projectId: "hotel-management-xxxxx",
  storageBucket: "hotel-management-xxxxx.appspot.com",
  messagingSenderId: "xxxxxxxxxxxx",
  appId: "1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxxxxx"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 