const fs = require('fs');

const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

// Add import for paypal
if (!code.includes('createSubscription')) {
  const importPaypal = `import { createSubscription, reviseSubscription, getSubscription, ensurePayPalPlans } from './server/paypal.js';\n`;
  code = code.replace(`import { getFirebaseAdmin`, importPaypal + `import { getFirebaseAdmin`);
}

// Add billing routes
const billingRoutes = `
  // PayPal Billing Routes
  const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const idToken = authHeader.split('Bearer ')[1];
      req.uid = (await getAdminAuth().verifyIdToken(idToken)).uid;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  app.post('/api/billing/subscribe', verifyToken, async (req, res) => {
    try {
      const { tier, returnUrl, cancelUrl } = req.body;
      const sub = await createSubscription(tier, returnUrl, cancelUrl);
      res.json(sub);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/billing/revise', verifyToken, async (req, res) => {
    try {
      const { subscriptionId, newTier, returnUrl, cancelUrl } = req.body;
      const result = await reviseSubscription(subscriptionId, newTier, returnUrl, cancelUrl);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/billing/execute', verifyToken, async (req, res) => {
    try {
      const { subscriptionId, tier } = req.body;
      // Fetch details to confirm
      const subDetails = await getSubscription(subscriptionId);
      if (subDetails.status === 'ACTIVE' || subDetails.status === 'APPROVAL_PENDING' || subDetails.status === 'APPROVED') {
        const db = getAdminDb();
        await db.collection('subscriptions').doc(req.uid).set({
          tierName: tier,
          paypalSubscriptionId: subscriptionId,
          billingStatus: subDetails.status,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Subscription not active' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/billing/execute-revision', verifyToken, async (req, res) => {
    try {
      const { subscriptionId, newTier, isDowngrade } = req.body;
      const subDetails = await getSubscription(subscriptionId);
      
      const db = getAdminDb();
      if (isDowngrade) {
        // Find next billing date
        const nextBillingTime = subDetails.billing_info?.next_billing_time;
        await db.collection('subscriptions').doc(req.uid).set({
          pendingDowngrade: {
            tierName: newTier,
            effectiveDate: nextBillingTime
          },
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } else {
        await db.collection('subscriptions').doc(req.uid).set({
          tierName: newTier,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
`;

if (!code.includes('/api/billing/subscribe')) {
  code = code.replace(`app.post('/api/auth/init'`, billingRoutes + `\n  app.post('/api/auth/init'`);
}

fs.writeFileSync(file, code);
