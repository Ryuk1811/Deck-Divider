import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, SubscriptionRecord } from '../types';

interface AuthContextValue {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  subscription: SubscriptionRecord | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  subscription: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  refreshSubscription: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndSubscription = async (userObj: FirebaseUser) => {
    const uid = userObj.uid;
    const isSuperUser = (userObj.email || '').toLowerCase() === 'gurutvamurdia@gmail.com';

    const googleName = userObj.displayName || 
                       userObj.providerData?.find(p => p.displayName)?.displayName || 
                       userObj.email?.split('@')[0] || 
                       'Collector';
    const googlePhoto = userObj.photoURL || 
                        userObj.providerData?.find(p => p.photoURL)?.photoURL || 
                        '';

    const defaultProf: UserProfile = {
      id: uid,
      displayName: googleName,
      email: userObj.email || '',
      avatar: googlePhoto,
      displayCurrency: 'USD',
      isSuperUser: isSuperUser,
      createdAt: new Date().toISOString()
    };
    const defaultSub: SubscriptionRecord = {
      id: uid,
      tierName: isSuperUser ? 'Collection' : 'Starter',
      isSuperUser: isSuperUser,
      billingStatus: 'active',
      updatedAt: new Date().toISOString()
    };

    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const existingData = userDoc.data() as UserProfile;
        const mergedProf: UserProfile = {
          ...existingData,
          displayName: googleName || existingData.displayName,
          avatar: googlePhoto || existingData.avatar || '',
          email: userObj.email || existingData.email,
          isSuperUser: isSuperUser || Boolean(existingData.isSuperUser),
        };
        setProfile(mergedProf);
        
        // Persist updated Google OAuth profile info if photo/name changed or super user
        const nameChanged = googleName && googleName !== existingData.displayName;
        const photoChanged = googlePhoto && googlePhoto !== existingData.avatar;
        const superUserNeedsUpdate = isSuperUser && !existingData.isSuperUser;

        if (nameChanged || photoChanged || superUserNeedsUpdate) {
          const updateObj: Partial<UserProfile> = {};
          if (nameChanged) updateObj.displayName = googleName;
          if (photoChanged) updateObj.avatar = googlePhoto;
          if (superUserNeedsUpdate) updateObj.isSuperUser = true;
          await setDoc(userRef, updateObj, { merge: true });
        }
      } else {
        await setDoc(userRef, defaultProf, { merge: true });
        setProfile(defaultProf);
      }

      const subRef = doc(db, 'subscriptions', uid);
      const subDoc = await getDoc(subRef);
      if (subDoc.exists()) {
        const subData = subDoc.data() as SubscriptionRecord;
        if (isSuperUser) {
          subData.tierName = 'Collection';
          subData.isSuperUser = true;
          await setDoc(subRef, { tierName: 'Collection', isSuperUser: true, billingStatus: 'active' }, { merge: true });
        }
        setSubscription(subData);
      } else {
        await setDoc(subRef, defaultSub, { merge: true });
        setSubscription(defaultSub);
      }
    } catch (err) {
      console.warn('Firestore profile sync warning (using defaults):', err);
      setProfile((prev) => prev || defaultProf);
      setSubscription((prev) => prev || defaultSub);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({
        prompt: 'select_account',
      });
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await fetchProfileAndSubscription(result.user);
      }
    } catch (err: any) {
      if (
        err.code === 'auth/popup-closed-by-user' || 
        err.code === 'auth/cancelled-popup-request' ||
        err.message?.includes('closed-by-user')
      ) {
        // Benign user popup dismissal
        return;
      }
      console.warn('[AuthContext] Google Sign In error:', err);
      throw err;
    }
  };

  const signOutUser = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
    setSubscription(null);
  };

  const refreshSubscription = async () => {
    if (!user) return;
    try {
      const subDoc = await getDoc(doc(db, 'subscriptions', user.uid));
      if (subDoc.exists()) {
        setSubscription(subDoc.data() as SubscriptionRecord);
      }
    } catch (e) {
      console.warn('Failed to refresh subscription:', e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Backend admin synchronization
        try {
          const token = await firebaseUser.getIdToken();
          await fetch('/api/auth/init', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (e) {
          console.error("Backend auth init error:", e);
        }
        await fetchProfileAndSubscription(firebaseUser);
      } else {
        setProfile(null);
        setSubscription(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      subscription, 
      loading, 
      signInWithGoogle, 
      signOutUser, 
      refreshSubscription 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
