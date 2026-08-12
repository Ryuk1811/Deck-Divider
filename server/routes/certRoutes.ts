import { Router } from 'express';
import { handleCertLookup, handleGradedMarketLookup } from '../controllers/certController.js';
import { certScraperLimiter } from '../middleware/rateLimiter.js';

export const certRoutes = Router();

certRoutes.use(certScraperLimiter);

certRoutes.get('/lookup', handleCertLookup);
certRoutes.get('/graded-market', handleGradedMarketLookup);

