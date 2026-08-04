const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const handleUpdateDeckCode = `
  const handleUpdateDeck = (updatedDeck: Deck) => {
    setDecks(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));
    triggerSyncPulse();
  };
`;

if (!code.includes("const handleUpdateDeck =")) {
  code = code.replace("const handleDeleteDeck =", handleUpdateDeckCode + "\n  const handleDeleteDeck =");
  fs.writeFileSync(file, code);
}
