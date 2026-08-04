const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// There are two handleUpdateDeck definitions now
const dupeRegex = /const handleUpdateDeck = \(updatedDeck: Deck\) => \{\s*triggerSyncPulse\(\);\s*setDecks\(decks\.map\(\(d\) => \(d\.id === updatedDeck\.id \? updatedDeck : d\)\)\);\s*\};\s*const handleDeleteDeck =/g;

code = code.replace(dupeRegex, "const handleDeleteDeck =");
fs.writeFileSync(file, code);
