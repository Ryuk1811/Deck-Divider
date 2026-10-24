import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, safeSetDoc } from './firebase';
import { UserProfile, SubscriptionRecord } from '../types';
import { evaluateSubscriptionGovernor } from '../utils/subscriptionGovernor';

interface AuthContextValue {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  subscription: SubscriptionRecord | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  subscription: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  refreshSubscription: async () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndSubscription = async (userObj: FirebaseUser) => {
    const uid = userObj.uid;
    const em = (userObj.email || '').toLowerCase();
    const isSuperUser = em === 'deckdivider@outlook.com' || em === 'gurutvamurdia@gmail.com';

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
          await safeSetDoc(userRef, updateObj, { merge: true });
        }
      } else {
        await safeSetDoc(userRef, defaultProf, { merge: true });
        setProfile(defaultProf);
      }

      const subRef = doc(db, 'subscriptions', uid);
      const subDoc = await getDoc(subRef);
      if (subDoc.exists()) {
        const rawSubData = subDoc.data() as SubscriptionRecord;
        const governed = evaluateSubscriptionGovernor(rawSubData, isSuperUser);
        
        if (isSuperUser) {
          await safeSetDoc(subRef, { 
            tierName: 'Collection', 
            effectiveTier: 'Collection', 
            isSuperUser: true, 
            billingStatus: 'active' 
          }, { merge: true });
        } else if (governed.isExpired && rawSubData.billingStatus !== 'expired') {
          // Sync expired status back to Firestore doc so all sessions reflect it
          await safeSetDoc(subRef, { 
            billingStatus: 'expired',
            effectiveTier: 'Starter',
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
        setSubscription(governed);
      } else {
        const governedDefault = evaluateSubscriptionGovernor(defaultSub, isSuperUser);
        await safeSetDoc(subRef, governedDefault, { merge: true });
        setSubscription(governedDefault);
      }
    } catch (err) {
      console.warn('Firestore profile sync warning (using defaults):', err);
      setProfile((prev) => prev || defaultProf);
      setSubscription((prev) => prev || evaluateSubscriptionGovernor(defaultSub, isSuperUser));
    }
  };

  const signInWithGoogle = async () => {
    let attempts = 0;
    while (attempts < 3) {
      try {
        const provider = new GoogleAuthProvider();
        // Use clean provider without duplicate scopes or forced 'select_account' prompt,
        // which prevents accounts.google.com from returning 401 "The server cannot process the request because it is malformed"
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          await fetchProfileAndSubscription(result.user);
        }
        return;
      } catch (err: any) {
        if (
          err.code === 'auth/popup-closed-by-user' || 
          err.code === 'auth/cancelled-popup-request' ||
          err.message?.includes('closed-by-user')
        ) {
          // Benign user popup dismissal
          return;
        }

        // Retry if tab backgrounding caused temporary database closure
        if (err.message?.includes('Database is closing/hidden') || err.message?.includes('closing')) {
          attempts++;
          await new Promise((res) => setTimeout(res, 400));
          continue;
        }

        console.warn('[AuthContext] Google Sign In error:', err);
        throw err;
      }
    }
  };

  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signOut warning:', e);
    }
    setUser(null);
    setProfile(null);
    setSubscription(null);
  };

  const refreshSubscription = async () => {
    if (!user) return;
    try {
      const em = (user.email || '').toLowerCase();
      const isSuperUser = em === 'deckdivider@outlook.com' || em === 'gurutvamurdia@gmail.com';
      const subDoc = await getDoc(doc(db, 'subscriptions', user.uid));
      if (subDoc.exists()) {
        const governed = evaluateSubscriptionGovernor(subDoc.data() as SubscriptionRecord, isSuperUser);
        setSubscription(governed);
      }
    } catch (e) {
      console.warn('Failed to refresh subscription:', e);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    setProfile((prev) => {
      if (!prev && user) {
        return {
          id: user.uid,
          displayName: user.displayName || 'Collector',
          email: user.email || '',
          avatar: user.photoURL || '',
          displayCurrency: 'USD',
          createdAt: new Date().toISOString(),
          ...data,
        };
      }
      return prev ? { ...prev, ...data } : null;
    });

    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await safeSetDoc(userRef, data, { merge: true });
      } catch (err) {
        console.warn('Failed to update user profile in Firestore:', err);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Fast background profile & backend sync without blocking route transitions
        (async () => {
          try {
            const token = await firebaseUser.getIdToken();
            fetch('/api/auth/init', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }).catch(e => console.warn('Auth init non-fatal notice:', e));
          } catch (e: any) {
            if (!e?.message?.includes('closing') && !e?.message?.includes('hidden')) {
              console.warn("Backend auth token error:", e);
            }
          }
          try {
            await fetchProfileAndSubscription(firebaseUser);
          } catch (e: any) {
            console.warn("Profile sync error notice:", e);
          }
        })();
      } else {
        setProfile(null);
        setSubscription(null);
      }
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
      refreshSubscription,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
