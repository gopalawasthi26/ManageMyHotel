import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, userType) {
    try {
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create the user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        userType,
        createdAt: new Date().toISOString()
      });

      // Get the updated user document
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      // Update the current user state
      setCurrentUser({ ...userCredential.user, ...userDoc.data() });

      return userCredential;
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get the user document from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }

      // Update the current user state with the user type from Firestore
      setCurrentUser({ ...userCredential.user, ...userDoc.data() });

      return userCredential;
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ ...user, ...userDoc.data() });
        } else {
          console.error('User document not found');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 