import { initializeApp, cert, getApps, getApp, App, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App | null = null;

const serviceAccount: ServiceAccount = {
  projectId: "deckdivider1",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@deckdivider1.iam.gserviceaccount.com",
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDeNL/io6aWcawW\nEEnhRwQB8fwnije+sP1yg5QUlQcHxdLveoaOtyP4JhE+TeRyMMPXdMU2oKQGdIOk\nj/EOcJVQH4zK+AtuZyI9njQCFP8vVdToIna2VguEd8BmX/ofe2ahA8OwlB7h4Tl+\n4CbTMKOGpiYh1SlZ1+J7+se59fil8JdGR5WLfQY9A8Qjd8zIv6gnUFMkOfv4Z1fh\ncD0pZwXbfD02s8yhgJXsSyQkl/qfGAv9UxmtuB+O98pxZPsNc5oAiiwXdLae2vQV\nwNzXinAa3BJuSPhf8msW2h8zrH7WfZfYtZCpO2aTy+Do6nm2F/HC/P/87TabCvEB\n19R7NZIJAgMBAAECggEAFpbpPPqjGF9E/dc5E4hbLXFyz3g7M40drvMWbkM6PD2N\ntJ/RpxeSNgt0rE9R3pP7jN9Hn0aUdj2JFoU1neCvJT6X2xh9XQNqFTaMlfuZd6/z\nnYfHZsD3mcdszVuLe4DZjZvq3HwqaY8yf6X8/HJQ5YLllIHtmr8aPL1haZPKa+AJ\nmKQCj2IRP81ZzNaNz5zcAyP8Sat1lyl/r0741uvmf6Wk2j7E5YvcTW7BeenR0Qcd\njxazGTl4HpOI8OyYIn9EbdfigGhgs+BJaG7whmrxeS67nzzpcTnDjLDHy/hRlVAE\nP7lfzuCypzaAIPtE7aqrmhkpES11S7ANr4sPPHLXwQKBgQDyu6xOjwfhb0wGaOZR\njDI3PX3Be4fMsp/RNgetipb4rxkvuWndoQ19NP2peFeqzgJFNi4xvpxu2mlxaR7n\nWD5HSo9WpkUJtR4UuBfXkn5pU3vekwYGmM0bcY6PDZ9vHDsmykAROOSCWDS6f2VH\ntlyKLMvWMCfqn9xxBgc4/ObV0QKBgQDqWdySOXhT74brY3KLWVhB5s5sBEUqbS4H\nKrhrbdUC37m8vt+5Y1zCQC+bp0ORqYLNIRW4p/uS4vJ1/IO+yYnSAV/4wwPKfWHp\ndoHZUXCf7p41DHs6jDbv6fwQdL0tBVYS7XecIcMXpcTwNz8TL3NtFxgzVdQDpHH6\nNOw5OUGuuQKBgF6EI2kHmsr2WoUYba6NR7Ro1kHzxwI2/7IoNr8levnkvIrvyMBL\nCQSbELbfrEtPImUu3rfx/9nOZEaL50OwAbgi2UOlRLat9sOcl3QSj/SVVGNrnmoN\nL7ii9B7R8CYEuSe2k1HhdGEo1YdVOeu9n7USEmEZqUFb9CtybHeNSpkxAoGAVn4s\nBlvnqTLyXNYrZHrpNAl3ji5VSL9bCZIe1qeGwrTH3H2mHMorZhZCe/RT3+LsP8FC\nPxDgrOnOCvXTugqwLy4KuclgENAN3xi5+/cu1hg/k9yzbnxpmkqFmZ08ZO1fQ0UZ\nrCpZ0tR/xxjc0rvkohKv/+Jhiaab2njF5qjXMSECgYEAhmFNB1DPG7bODT6Hfy72\nCYJAATk5RGC5D/vF58qHitrrYqN6bdwm1/2X2zWxjZxySP+5CDtV6UyHVrJBkBvv\nluSWLJFL+9nSHjiq7DCrpEq5M4EidJvJSmIuyVfqKCIsIg+ULxTKYC1PB0BAvFIs\nwYSCadO5E5mMnHIPYKwFEww=\n-----END PRIVATE KEY-----\n`).replace(/\\n/g, '\n'),
};

export function getFirebaseAdmin(): App {
  if (!adminApp) {
    const existingApps = getApps();
    if (!existingApps.length) {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.projectId,
      });
    } else {
      adminApp = getApp();
    }
  }
  return adminApp;
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdmin());
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdmin());
}
