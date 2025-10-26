// src/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // تۆمارکردنی یوسەری نوێ
  async function signup(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // زیادکردنی زانیاری یوسەر لە Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: email,
      displayName: displayName,
      createdAt: new Date().toISOString()
    });
    
    return userCredential;
  }

  // چوونەژوورەوەی یوسەر
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // دەرچوونی یوسەر
  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
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