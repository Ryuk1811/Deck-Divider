import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
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
export const auth = getAuth(firebaseApp);
export const db = getFirestore(
  firebaseApp,
  firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== "(default)"
    ? firebaseConfigJson.firestoreDatabaseId
    : "(default)"
);

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
