const fs = require('fs');

const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add imports
if (!code.includes("import { collection, onSnapshot }")) {
  code = code.replace("import { db } from './lib/firebase';", "import { db } from './lib/firebase';\nimport { collection, onSnapshot } from 'firebase/firestore';");
}

// Replace the useEffect block for decks
const useDecksEffect = `
  React.useEffect(() => {
    if (!user) {
      setDecks(INITIAL_DECKS);
      setSoldEntries(INITIAL_SOLD_ENTRIES);
      setCustomLists(INITIAL_LISTS);
      return;
    }
    const unsubDecks = onSnapshot(collection(db, 'users', user.uid, 'decks'), (snap) => {
      const liveDecks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setDecks(liveDecks.length > 0 ? liveDecks : INITIAL_DECKS);
    });
    return () => {
      unsubDecks();
    };
  }, [user]);
`;

if (!code.includes("const unsubDecks = onSnapshot")) {
  code = code.replace(`  // Core Data Collections`, useDecksEffect + `\n  // Core Data Collections`);
}

fs.writeFileSync(file, code);
