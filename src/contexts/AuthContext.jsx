import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  fetchSignInMethodsForEmail
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

  async function signup(email, password, userType, name) {
    try {
      // Validate input
      if (!email || !password || !userType || !name) {
        throw new Error('All fields are required');
      }

      // Check if email is already registered
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        throw new Error('This email is already registered. Please use a different email or login.');
      }

      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create the user document in Firestore
      const userData = {
        email,
        userType,
        name,
        createdAt: new Date().toISOString(),
        isActive: true,
        phone: "",
        address: "",
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      // Get the updated user document
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('Failed to create user document');
      }

      // Update the current user state
      setCurrentUser({ ...userCredential.user, ...userDoc.data() });

      return userCredential;
    } catch (error) {
      console.error('Error in signup:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please use a different email or login.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address. Please enter a valid email.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use a stronger password.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password accounts are not enabled. Please contact support.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else {
        // Handle custom errors
        throw new Error(error.message || 'Failed to create account. Please try again.');
      }
    }
  }

  async function login(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }

      const userData = userDoc.data();
      
      // Check if user is active
      if (!userData.isActive) {
        throw new Error('Your account has been deactivated. Please contact support.');
      }

      setCurrentUser({ ...userCredential.user, ...userData });
      
      return { user: { ...userCredential.user, ...userData } };
    } catch (error) {
      console.error('Error in login:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please sign up.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address. Please enter a valid email.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else {
        // Handle custom errors
        throw new Error(error.message || 'Failed to login. Please try again.');
      }
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Check if user is active
            if (!userData.isActive) {
              await logout();
              return;
            }
            setCurrentUser({ ...user, ...userData });
          } else {
            // If user document doesn't exist, create it with default values
            const defaultUserData = {
              email: user.email,
              userType: 'guest',
              name: user.displayName || user.email.split('@')[0],
              createdAt: new Date().toISOString(),
              isActive: true,
              phone: "",
              address: "",
            };
            
            await setDoc(doc(db, 'users', user.uid), defaultUserData);
            setCurrentUser({ ...user, ...defaultUserData });
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
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