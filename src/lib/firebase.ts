import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  browserLocalPersistence, 
  indexedDBLocalPersistence, 
  inMemoryPersistence,
  browserPopupRedirectResolver
} from "firebase/auth";
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  doc, 
  getDocFromServer,
  setDoc,
  type SetOptions,
  type DocumentReference
} from "firebase/firestore";
import firebaseConfigJson from "../../firebase-applet-config.json";

// User's explicit Firebase Project configuration for deckdivider1
const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey || "AIzaSyDFS0JIrRYbVBkbOvthQtHpngmOeDVj8cs",
  authDomain: firebaseConfigJson.authDomain || "deckdivider1.firebaseapp.com",
  projectId: firebaseConfigJson.projectId || "deckdivider1",
  storageBucket: firebaseConfigJson.storageBucket || "deckdivider1.firebasestorage.app",
  messagingSenderId: firebaseConfigJson.messagingSenderId || "117584496178",
  appId: firebaseConfigJson.appId || "1:117584496178:web:c13131c44c0f1735dd9e2b",
  measurementId: firebaseConfigJson.measurementId || "G-W83PHH9QFN"
};

// Initialize Firebase Client
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth with browserLocalPersistence and indexedDB fallbacks.
// Critically include browserPopupRedirectResolver so signInWithPopup / signInWithRedirect never trigger auth/argument-error
export const auth = (() => {
  if (typeof window !== 'undefined') {
    try {
      return initializeAuth(firebaseApp, {
        persistence: [browserLocalPersistence, indexedDBLocalPersistence, inMemoryPersistence],
        popupRedirectResolver: browserPopupRedirectResolver
      });
    } catch {
      return getAuth(firebaseApp);
    }
  }
  return getAuth(firebaseApp);
})();

const databaseId = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== "(default)"
  ? firebaseConfigJson.firestoreDatabaseId
  : "(default)";

// Initialize Firestore with auto-detect long polling and multi-tab offline caching
// This prevents WebChannelConnection stream transport dropouts in sandboxed iframes & reverse-proxy networks
export const db = (() => {
  if (typeof window !== 'undefined') {
    try {
      return initializeFirestore(
        firebaseApp,
        {
          experimentalAutoDetectLongPolling: true,
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager()
          })
        },
        databaseId
      );
    } catch {
      try {
        return initializeFirestore(
          firebaseApp,
          {
            experimentalAutoDetectLongPolling: true
          },
          databaseId
        );
      } catch {
        return getFirestore(firebaseApp, databaseId);
      }
    }
  }
  return getFirestore(firebaseApp, databaseId);
})();

// Connection test at boot as mandated by Firebase skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    // Non-blocking connection check
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or network connection.");
    }
  }
}
testConnection().catch((err) => {
  console.warn('Firebase testConnection non-fatal error:', err);
});

// Structured Firestore error formatting
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error Context: ', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Recursively removes all keys with `undefined` values from an object or array.
 * Firestore strictly rejects documents containing `undefined` at any depth.
 */
export function cleanFirestoreData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const proto = Object.getPrototypeOf(data);
    if (proto !== Object.prototype && proto !== null) {
      return data;
    }
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        result[key] = cleanFirestoreData(value);
      }
    }
    return result as T;
  }
  return data;
}

/**
 * Robust wrapper around Firestore setDoc that automatically purges all `undefined`
 * fields to guarantee compliance with Firestore's strict data model.
 */
export async function safeSetDoc<T extends Record<string, any>>(
  reference: DocumentReference,
  data: T,
  options?: SetOptions
) {
  const cleaned = cleanFirestoreData(data);
  return options ? setDoc(reference, cleaned, options) : setDoc(reference, cleaned);
}

