const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("import { db, auth } from")) {
  code = code.replace("import { Loader2 } from 'lucide-react';", "import { Loader2 } from 'lucide-react';\nimport { db, auth } from './lib/firebase';\nimport { collection, onSnapshot } from 'firebase/firestore';");
}

fs.writeFileSync(file, code);
