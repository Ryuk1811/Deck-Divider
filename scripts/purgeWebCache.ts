/**
 * Standalone Web Cache Purge & IndexNow Broadcaster CLI
 * Directly invalidates search engine and AI crawler caches across the web.
 * Usage: npx tsx scripts/purgeWebCache.ts
 */

import { getAllPublicUrls, CANONICAL_ORIGIN } from '../server/publicFootprintManager.js';
import { broadcastFullSitePurge } from '../server/indexNow.js';

async function main() {
  console.log('================================================================');
  console.log('⚡ DECK / divider — Direct Web Cache Purge & Broadcaster');
  console.log('================================================================');
  console.log(`[Target Host]: ${CANONICAL_ORIGIN}`);
  console.log(`[Timestamp]:   ${new Date().toISOString()}`);

  console.log('\n[1/3] Compiling complete canonical URL catalog & markdown mirrors...');
  const urls = await getAllPublicUrls(CANONICAL_ORIGIN);
  console.log(`✓ Collected ${urls.length} indexable URLs (HTML pages, .md mirrors, sitemaps).`);

  console.log('\n[2/3] Dispatching parallel IndexNow API invalidation requests...');
  const sitemapUrl = `${CANONICAL_ORIGIN}/sitemap-index.xml`;
  const broadcastResult = await broadcastFullSitePurge(urls, sitemapUrl);

  console.log('\n[3/3] Broadcasting search engine sitemap pings (Google & Bing)...');
  broadcastResult.sitemapPingResults.forEach(p => {
    console.log(`  - ${p.engine}: HTTP ${p.status} (${p.success ? 'Success' : 'Notice'})`);
  });

  console.log('\n================================================================');
  console.log('✓ Cache Purge & Broadcaster Complete!');
  console.log(`  • Total URLs submitted: ${broadcastResult.totalUrls}`);
  console.log(`  • IndexNow Batches:    ${broadcastResult.indexNowResults.length}`);
  console.log('================================================================\n');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error during cache purge broadcast:', err);
  process.exit(1);
});
