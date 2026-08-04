const fs = require('fs');
const file = 'src/views/SettingsView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /exportDataSignal\?: number;\s*customLists\?: any\[\];\s*customLists\?: any\[\];/g,
  "exportDataSignal?: number;\n  customLists?: any[];"
);

code = code.replace(
  /export const SettingsView: React\.FC<SettingsViewProps> = \(\{\s*currency,\s*onSelectCurrency,\s*currentTier,\s*onChangeTier,\s*decks,\s*soldEntries,\s*lists: customLists \|\| \[\],\s*exportDataSignal,\s*customLists,\s*\}\) => \{/g,
  `export const SettingsView: React.FC<SettingsViewProps> = ({
  currency,
  onSelectCurrency,
  currentTier,
  onChangeTier,
  decks,
  soldEntries,
  customLists = [],
  exportDataSignal,
}) => {`
);

const handleExportOld = /const handleExportData = \(\) => \{\s*const dataObj = \{\s*exportDate: new Date\(\)\.toISOString\(\),\s*currentTier,\s*currencyPreference: currency,\s*decks,\s*soldEntries,\s*lists: \[\],\s*\};\s*const jsonString =/g;
code = code.replace(handleExportOld, `const handleExportData = () => {
    const dataObj = {
      exportDate: new Date().toISOString(),
      currentTier,
      currencyPreference: currency,
      decks,
      soldEntries,
      customLists,
    };
    const jsonString =`);

fs.writeFileSync(file, code);
