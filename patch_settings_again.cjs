const fs = require('fs');
const file = 'src/views/SettingsView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace("exportDataSignal?: number;", "exportDataSignal?: number;\n  customLists?: any[];");
code = code.replace("exportDataSignal,", "exportDataSignal,\n  customLists,");
code = code.replace("decks,\\n      soldEntries,\\n    };", "decks,\n      soldEntries,\n      customLists,\n    };");

fs.writeFileSync(file, code);
