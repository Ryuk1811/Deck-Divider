const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const origAdd = "const handleAddCardToDeck = (\n    deckId: string,\n    entryData: Omit<PortfolioCardEntry, 'id' | 'isSold'>,\n    mode: 'increment' | 'separate'\n  ) => {";

const replaceAdd = `
  const handleAddCardToDeck = async (
    deckId: string,
    entryData: Omit<PortfolioCardEntry, 'id' | 'isSold'>,
    mode: 'increment' | 'separate'
  ) => {
    triggerSyncPulse();
    if (user) {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(\`/api/decks/\${deckId}/cards\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
        body: JSON.stringify({ ...entryData, mode })
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to add card');
      }
    } else {
      // Local fallback
      setDecks(
        decks.map((deck) => {
          if (deck.id !== deckId) return deck;
          if (mode === 'increment') {
            const existing = deck.entries.find(
              (e) => !e.isSold && e.cardId === entryData.cardId && e.condition === entryData.condition
            );
            if (existing) {
              return {
                ...deck,
                entries: deck.entries.map((e) =>
                  e.id === existing.id ? { ...e, quantity: e.quantity + entryData.quantity } : e
                ),
              };
            }
          }
          const newEntry: PortfolioCardEntry = {
            id: \`entry-\${Date.now()}\`,
            ...entryData,
            isSold: false,
          };
          return { ...deck, entries: [...deck.entries, newEntry] };
        })
      );
    }
  };
`;

if (code.includes(origAdd)) {
  const parts = code.split(origAdd);
  const tail = parts[1];
  const endIdx = tail.indexOf("  };\n\n  const handleUpdateCard");
  if (endIdx !== -1) {
    code = parts[0] + replaceAdd + "\n  const handleUpdateCard" + tail.substring(endIdx + 25);
    fs.writeFileSync(file, code);
  }
}
