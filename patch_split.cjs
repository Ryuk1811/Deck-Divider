const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const origSplit = "const handleSplitDeckGroup = (\n    sourceDeckId: string,\n    cardIdsToSplit: string[],\n    newDeckName: string\n  ) => {";
if (code.includes(origSplit)) {
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
  const parts = code.split(origSplit);
  const tail = parts[1];
  const endIdx = tail.indexOf("  };\n\n  const handleAddCardToDeck");
  if (endIdx !== -1) {
    code = parts[0] + replaceSplit + "\n  const handleAddCardToDeck" + tail.substring(endIdx + 28);
    fs.writeFileSync(file, code);
  } else {
    console.log("Could not find end of handleSplitDeckGroup");
  }
}
