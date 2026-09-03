import { initializeApp, cert, getApps, getApp, App, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

let adminApp: App | null = null;
let isServiceAccountLoaded = false;

export function hasAdminCredentials(): boolean {
  if (isServiceAccountLoaded) return true;
  const saPath = path.join(process.cwd(), 'firebase-service-account.json');
  if (fs.existsSync(saPath)) return true;
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) return true;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) return true;
  return false;
}

export function getFirebaseAdmin(): App {
  if (!adminApp) {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      adminApp = getApp();
    } else {
      let serviceAccount: ServiceAccount | null = null;

      // 1. Try reading from root firebase-service-account.json
      const saPath = path.join(process.cwd(), 'firebase-service-account.json');
      if (fs.existsSync(saPath)) {
        try {
          const saData = JSON.parse(fs.readFileSync(saPath, 'utf8'));
          if (saData && saData.project_id && saData.private_key && saData.client_email) {
            serviceAccount = {
              projectId: saData.project_id,
              clientEmail: saData.client_email,
              privateKey: saData.private_key.replace(/\\n/g, '\n'),
            };
            isServiceAccountLoaded = true;
            console.log(`[FirebaseAdmin] Loaded credentials from firebase-service-account.json (${serviceAccount.clientEmail})`);
          }
        } catch (err) {
          console.warn('[FirebaseAdmin] Failed to parse firebase-service-account.json:', err);
        }
      }

      // 2. Try JSON env variable
      if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
          const saData = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
          if (saData && saData.project_id && saData.private_key && saData.client_email) {
            serviceAccount = {
              projectId: saData.project_id,
              clientEmail: saData.client_email,
              privateKey: saData.private_key.replace(/\\n/g, '\n'),
            };
            isServiceAccountLoaded = true;
          }
        } catch (_) {}
      }

      // 3. Try individual environment variables
      if (!serviceAccount && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID || 'deckdivider1',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };
        isServiceAccountLoaded = true;
      }

      // 4. Fallback: Initialize using Application Default Credentials or projectId
      let projectId = process.env.FIREBASE_PROJECT_ID || 'deckdivider1';
      const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
      if (fs.existsSync(configPath)) {
        try {
          const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          if (cfg.projectId) projectId = cfg.projectId;
        } catch (_) {}
      }

      if (serviceAccount) {
        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.projectId,
        });
        isServiceAccountLoaded = true;
        console.log(`[FirebaseAdmin] Successfully initialized Firebase Admin SDK with service account for project '${serviceAccount.projectId}' (${serviceAccount.clientEmail})`);
      } else {
        adminApp = initializeApp({
          projectId: projectId,
        });
        isServiceAccountLoaded = false;
        console.log(`[FirebaseAdmin] Initialized Firebase Admin SDK for project '${projectId}' using default credentials`);
      }
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


