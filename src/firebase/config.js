import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBWn96pUdA_hxDuZoMKO0y29PwxxvOLCBg",
    authDomain: "managemyhotel-729bc.firebaseapp.com",
    projectId: "managemyhotel-729bc",
    storageBucket: "managemyhotel-729bc.firebasestorage.app",
    messagingSenderId: "534706745543",
    appId: "1:534706745543:web:c711122c59dfadc7e00ee2"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 