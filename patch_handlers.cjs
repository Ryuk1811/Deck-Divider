const fs = require('fs');

const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("import { auth } from './lib/firebase';")) {
  code = code.replace("import { db } from './lib/firebase';", "import { db, auth } from './lib/firebase';");
}

const origCreate = "const handleCreateDeck = (deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt' | 'entries'>) => {";
const replaceCreate = `
  const handleCreateDeck = async (deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt' | 'entries'>) => {
    triggerSyncPulse();
    if (user) {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
        body: JSON.stringify(deckData)
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to create deck');
      }
    } else {
      const newDeck: Deck = {
        id: \`deck-\${Date.now()}\`,
        ...deckData,
        entries: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDecks([newDeck, ...decks]);
    }
  };
`;

const origSplit = "const handleSplitDeckGroup = (";
const replaceSplit = `
  const handleSplitDeckGroup = async (
    sourceDeckId: string,
    cardIdsToSplit: string[],
    newDeckName: string
  ) => {
    triggerSyncPulse();
    if (user) {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(\`/api/decks/\${sourceDeckId}/split\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
        body: JSON.stringify({ cardIdsToSplit, newDeckName })
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to split deck');
      }
    } else {
      // Local fallback
      const sourceDeck = decks.find((d) => d.id === sourceDeckId);
      if (!sourceDeck) return;
      const entriesToMove = sourceDeck.entries.filter((e) => cardIdsToSplit.includes(e.cardId));
      const remainingEntries = sourceDeck.entries.filter((e) => !cardIdsToSplit.includes(e.cardId));
      const newSplitDeck: Deck = {
        id: \`deck-split-\${Date.now()}\`,
        name: newDeckName,
        description: \`Split group from \${sourceDeck.name}\`,
        colorHex: sourceDeck.colorHex,
        isPublic: sourceDeck.isPublic,
        entries: entriesToMove,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDecks([
        ...decks.map((d) => (d.id === sourceDeckId ? { ...d, entries: remainingEntries } : d)),
        newSplitDeck,
      ]);
    }
  };
`;

// Replace functions if not already replaced
if (code.includes(origCreate)) {
  const parts = code.split(origCreate);
  // find end of block for createDeck
  const tail = parts[1];
  const endIdx = tail.indexOf("  };\n\n  const handleUpdateDeck");
  code = parts[0] + replaceCreate + "\n  const handleUpdateDeck" + tail.substring(endIdx + 25);
}

fs.writeFileSync(file, code);
