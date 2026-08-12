import { scrapePSA } from './server/services/scrapers/psaScraper.js';
(async () => {
  const result = await scrapePSA('69225215');
  console.log(result);
  process.exit(0);
})();
