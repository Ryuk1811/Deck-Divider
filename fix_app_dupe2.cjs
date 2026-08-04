const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const strToReplace = `  const handleUpdateDeck = (updatedDeck: Deck) => {
    triggerSyncPulse();
    setDecks(decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));
  };`;

code = code.replace(strToReplace, "");
fs.writeFileSync(file, code);
