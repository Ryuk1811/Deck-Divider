const fs = require('fs');
const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

const deckRoutes = `
  // Deck & Limit Routes
  const TIER_LIMITS = {
    Starter: { maxDecks: 4, maxCards: 25 },
    Bunch: { maxDecks: 9, maxCards: 40 },
    Stack: { maxDecks: 15, maxCards: 50 },
    Deck: { maxDecks: 18, maxCards: 60 },
    Collection: { maxDecks: 99999, maxCards: 99999 }
  };

  app.post('/api/decks', verifyToken, async (req, res) => {
    try {
      const db = getAdminDb();
      const subDoc = await db.collection('subscriptions').doc(req.uid).get();
      const tierName = subDoc.data()?.tierName || 'Starter';
      const maxDecks = TIER_LIMITS[tierName]?.maxDecks || 4;

      const snapshot = await db.collection('users').doc(req.uid).collection('decks').count().get();
      if (snapshot.data().count >= maxDecks) {
        return res.status(403).json({ error: 'Tier limit exceeded for decks' });
      }

      const deckRef = db.collection('users').doc(req.uid).collection('decks').doc();
      const newDeck = {
        ...req.body,
        id: deckRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: []
      };
      await deckRef.set(newDeck);
      res.json(newDeck);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/decks/:deckId/cards', verifyToken, async (req, res) => {
    try {
      const db = getAdminDb();
      const subDoc = await db.collection('subscriptions').doc(req.uid).get();
      const tierName = subDoc.data()?.tierName || 'Starter';
      const maxCards = TIER_LIMITS[tierName]?.maxCards || 25;

      const deckRef = db.collection('users').doc(req.uid).collection('decks').doc(req.params.deckId);
      
      await db.runTransaction(async (t) => {
        const deckDoc = await t.get(deckRef);
        if (!deckDoc.exists) throw new Error('Deck not found');
        const deck = deckDoc.data();
        
        // Compute active cards
        const activeCards = (deck.entries || []).filter(e => !e.isSold);
        
        if (activeCards.length >= maxCards) {
          throw new Error('Tier limit exceeded for cards in this deck');
        }

        const newEntry = {
          ...req.body,
          id: 'entry-' + Date.now(),
          createdAt: new Date().toISOString()
        };
        
        const updatedEntries = [...(deck.entries || []), newEntry];
        t.update(deckRef, { 
          entries: updatedEntries,
          updatedAt: new Date().toISOString()
        });
      });
      
      res.json({ success: true });
    } catch (err) {
      if (err.message.includes('Tier limit exceeded')) {
        return res.status(403).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/decks/:deckId/split', verifyToken, async (req, res) => {
    try {
      const db = getAdminDb();
      const { cardIdsToSplit, newDeckName } = req.body;
      const sourceDeckId = req.params.deckId;

      const subDoc = await db.collection('subscriptions').doc(req.uid).get();
      const tierName = subDoc.data()?.tierName || 'Starter';
      const maxDecks = TIER_LIMITS[tierName]?.maxDecks || 4;

      await db.runTransaction(async (t) => {
        // Check deck limit
        const snapshot = await t.get(db.collection('users').doc(req.uid).collection('decks'));
        if (snapshot.size >= maxDecks) {
          throw new Error('Tier limit exceeded for decks');
        }
        
        const sourceRef = db.collection('users').doc(req.uid).collection('decks').doc(sourceDeckId);
        const sourceDoc = await t.get(sourceRef);
        if (!sourceDoc.exists) throw new Error('Source deck not found');
        const sourceData = sourceDoc.data();
        
        const entriesToMove = sourceData.entries.filter(e => cardIdsToSplit.includes(e.cardId));
        const remainingEntries = sourceData.entries.filter(e => !cardIdsToSplit.includes(e.cardId));
        
        const newDeckRef = db.collection('users').doc(req.uid).collection('decks').doc();
        const newDeck = {
          id: newDeckRef.id,
          name: newDeckName,
          description: \`Split from \${sourceData.name}\`,
          colorHex: sourceData.colorHex,
          isPublic: sourceData.isPublic,
          entries: entriesToMove,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        t.update(sourceRef, { entries: remainingEntries, updatedAt: new Date().toISOString() });
        t.set(newDeckRef, newDeck);
      });
      
      res.json({ success: true });
    } catch (err) {
      if (err.message.includes('Tier limit exceeded')) {
        return res.status(403).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  });
`;

if (!code.includes('/api/decks/:deckId/split')) {
  code = code.replace(`app.post('/api/billing/execute-revision'`, deckRoutes + `\n  app.post('/api/billing/execute-revision'`);
  fs.writeFileSync(file, code);
}
