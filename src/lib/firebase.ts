import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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
