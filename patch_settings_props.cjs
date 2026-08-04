const fs = require('fs');
const file = 'src/views/SettingsView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "exportDataSignal?: number;", 
  "exportDataSignal?: number;\n  customLists?: any[];"
);

code = code.replace(
  "exportDataSignal,\n}) => {", 
  "exportDataSignal,\n  customLists,\n}) => {"
);

code = code.replace(
  "soldEntries,\n      lists: [],", 
  "soldEntries,\n      lists: customLists || [],"
);

fs.writeFileSync(file, code);
