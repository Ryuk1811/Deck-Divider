import type { Request, Response, NextFunction } from 'express';
import { getAdminAuth } from '../firebaseAdmin.js';

export const SUPER_USER_EMAIL = 'gurutvamurdia@gmail.com';

export interface AuthenticatedRequest extends Request {
  uid?: string;
  userEmail?: string;
  user?: any;
  isSuperUser?: boolean;
}

/**
 * Validates cryptographic Firebase ID Token signature against Google public keys.
 * Strictly rejects forged, unverified, or expired tokens without insecure fallbacks.
 */
export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or malformed authorization header' });
    return;
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Empty token provided' });
    return;
  }

  try {
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.uid = decodedToken.uid;
    req.userEmail = (decodedToken.email || '').toLowerCase();
    req.user = decodedToken;
    req.isSuperUser = req.userEmail === SUPER_USER_EMAIL;
    next();
  } catch (err: any) {
    console.warn('[AuthMiddleware] Cryptographic ID token verification failed:', err.message);
    res.status(401).json({ error: 'Unauthorized: Invalid or expired authentication token' });
  }
}

/**
 * Requires verified Super User authorization (gurutvamurdia@gmail.com).
 * Cryptographically verifies token signature before inspecting the email claim.
 */
export async function requireSuperUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  await authenticateToken(req, res, () => {
    if (!req.isSuperUser) {
      res.status(403).json({ error: 'Forbidden: Super User privileges required' });
      return;
    }
    next();
  });
}
