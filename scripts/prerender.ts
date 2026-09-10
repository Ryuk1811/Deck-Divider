import fs from 'fs';
import path from 'path';
import { renderSsrRoute, injectSsrIntoTemplate } from '../server/ssrRenderer.js';
import { getExpansions } from '../server/tcgCatalogManager.js';
import { pingIndexNow } from '../server/indexNow.js';
import { generateOgHeroImage } from './generateOgHero.js';
import { writeAllFootprintFiles, getAllPublicUrls } from '../server/publicFootprintManager.js';

async function prerenderAllRoutes() {
  const distDir = path.resolve(process.cwd(), 'dist');

  // Ensure high-fidelity 1200x630 Hero OG Image exists in both public/ and dist/
  try {
    await generateOgHeroImage();
  } catch (ogErr) {
    console.warn('[Prerender] Notice: Failed generating OG Hero Image:', ogErr);
  }
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.warn('[Prerender] dist/index.html not found. Skipping static prerender.');
    return;
  }
  const rawTemplate = fs.readFileSync(templatePath, 'utf-8');

  // 1. Create clean 200.html for Cloudflare Pages SPA zero-redirect fallback
  const spaFallbackPath = path.join(distDir, '200.html');
  fs.writeFileSync(spaFallbackPath, rawTemplate, 'utf-8');
  console.log('[Prerender] ✓ Successfully generated 200.html SPA fallback.');

  // 2. Comprehensive public routes list for static pre-rendering
  const publicRoutes: Array<{ route: string; outputPath: string }> = [
    { route: '/', outputPath: path.join(distDir, 'index.html') },
    { route: '/pricing', outputPath: path.join(distDir, 'pricing', 'index.html') },
    { route: '/faq', outputPath: path.join(distDir, 'faq', 'index.html') },
    { route: '/about', outputPath: path.join(distDir, 'about', 'index.html') },
    { route: '/how-it-works', outputPath: path.join(distDir, 'how-it-works', 'index.html') },
    { route: '/privacy', outputPath: path.join(distDir, 'privacy', 'index.html') },
    { route: '/terms', outputPath: path.join(distDir, 'terms', 'index.html') },
    { route: '/changelog', outputPath: path.join(distDir, 'changelog', 'index.html') },
    { route: '/features', outputPath: path.join(distDir, 'features', 'index.html') },
    { route: '/support', outputPath: path.join(distDir, 'support', 'index.html') },
    { route: '/contact', outputPath: path.join(distDir, 'contact', 'index.html') },
    { route: '/cookie-policy', outputPath: path.join(distDir, 'cookie-policy', 'index.html') },
    { route: '/security', outputPath: path.join(distDir, 'security', 'index.html') },
    { route: '/media-kit', outputPath: path.join(distDir, 'media-kit', 'index.html') },
    { route: '/sets', outputPath: path.join(distDir, 'sets', 'index.html') },
    { route: '/leaderboard', outputPath: path.join(distDir, 'leaderboard', 'index.html') },
    { route: '/community', outputPath: path.join(distDir, 'community', 'index.html') },

    // Formats & Legality
    { route: '/formats', outputPath: path.join(distDir, 'formats', 'index.html') },
    { route: '/formats/standard', outputPath: path.join(distDir, 'formats', 'standard', 'index.html') },
    { route: '/formats/expanded', outputPath: path.join(distDir, 'formats', 'expanded', 'index.html') },
    { route: '/formats/glc', outputPath: path.join(distDir, 'formats', 'glc', 'index.html') },

    // Competitor Comparisons (High Intent Commercial Queries)
    { route: '/compare', outputPath: path.join(distDir, 'compare', 'index.html') },
    { route: '/compare/collectr', outputPath: path.join(distDir, 'compare', 'collectr', 'index.html') },
    { route: '/compare/pokellector', outputPath: path.join(distDir, 'compare', 'pokellector', 'index.html') },
    { route: '/compare/pricecharting', outputPath: path.join(distDir, 'compare', 'pricecharting', 'index.html') },
    { route: '/compare/dex', outputPath: path.join(distDir, 'compare', 'dex', 'index.html') },
    { route: '/compare/tcg-collector', outputPath: path.join(distDir, 'compare', 'tcg-collector', 'index.html') },
    { route: '/compare/dragon-shield', outputPath: path.join(distDir, 'compare', 'dragon-shield', 'index.html') },

    // Best-of Buyer Guides
    { route: '/best', outputPath: path.join(distDir, 'best', 'index.html') },
    { route: '/best/pokemon-card-trackers', outputPath: path.join(distDir, 'best', 'pokemon-card-trackers', 'index.html') },
    { route: '/best/slab-scanners', outputPath: path.join(distDir, 'best', 'slab-scanners', 'index.html') },
    { route: '/best/deck-builders', outputPath: path.join(distDir, 'best', 'deck-builders', 'index.html') },

    // High Intent Utility Tools
    { route: '/tools', outputPath: path.join(distDir, 'tools', 'index.html') },
    { route: '/tools/psa-grade-calculator', outputPath: path.join(distDir, 'tools', 'psa-grade-calculator', 'index.html') },
    { route: '/tools/deck-legality-checker', outputPath: path.join(distDir, 'tools', 'deck-legality-checker', 'index.html') },

    // Programmatic Tournament Deck Archetypes (Plural & Singular Aliases)
    { route: '/decks/gardevoir-ex', outputPath: path.join(distDir, 'decks', 'gardevoir-ex', 'index.html') },
    { route: '/deck/gardevoir-ex', outputPath: path.join(distDir, 'deck', 'gardevoir-ex', 'index.html') },
    { route: '/decks/charizard-ex', outputPath: path.join(distDir, 'decks', 'charizard-ex', 'index.html') },
    { route: '/deck/charizard-ex', outputPath: path.join(distDir, 'deck', 'charizard-ex', 'index.html') },
    { route: '/decks/regidrago-vstar', outputPath: path.join(distDir, 'decks', 'regidrago-vstar', 'index.html') },
    { route: '/deck/regidrago-vstar', outputPath: path.join(distDir, 'deck', 'regidrago-vstar', 'index.html') },
    { route: '/decks/dragapult-ex', outputPath: path.join(distDir, 'decks', 'dragapult-ex', 'index.html') },
    { route: '/deck/dragapult-ex', outputPath: path.join(distDir, 'deck', 'dragapult-ex', 'index.html') },
    { route: '/decks/miraidon-ex', outputPath: path.join(distDir, 'decks', 'miraidon-ex', 'index.html') },
    { route: '/deck/miraidon-ex', outputPath: path.join(distDir, 'deck', 'miraidon-ex', 'index.html') },
    { route: '/decks/lugia-vstar', outputPath: path.join(distDir, 'decks', 'lugia-vstar', 'index.html') },
    { route: '/deck/lugia-vstar', outputPath: path.join(distDir, 'deck', 'lugia-vstar', 'index.html') },
    { route: '/decks/lost-box-giratina', outputPath: path.join(distDir, 'decks', 'lost-box-giratina', 'index.html') },
    { route: '/deck/lost-box-giratina', outputPath: path.join(distDir, 'deck', 'lost-box-giratina', 'index.html') },
    { route: '/decks/chien-pao-ex', outputPath: path.join(distDir, 'decks', 'chien-pao-ex', 'index.html') },
    { route: '/deck/chien-pao-ex', outputPath: path.join(distDir, 'deck', 'chien-pao-ex', 'index.html') },
    { route: '/decks/raging-bolt-ex', outputPath: path.join(distDir, 'decks', 'raging-bolt-ex', 'index.html') },
    { route: '/deck/raging-bolt-ex', outputPath: path.join(distDir, 'deck', 'raging-bolt-ex', 'index.html') },
    { route: '/decks/gholdengo-ex', outputPath: path.join(distDir, 'decks', 'gholdengo-ex', 'index.html') },
    { route: '/deck/gholdengo-ex', outputPath: path.join(distDir, 'deck', 'gholdengo-ex', 'index.html') },
    { route: '/decks/future-box-iron-crown', outputPath: path.join(distDir, 'decks', 'future-box-iron-crown', 'index.html') },
    { route: '/deck/future-box-iron-crown', outputPath: path.join(distDir, 'deck', 'future-box-iron-crown', 'index.html') },
  ];

  let sets: any[] = [];
  try {
    console.log('[Prerender] Fetching TCG Expansions for dynamic static generation...');
    sets = await getExpansions();
    if (Array.isArray(sets) && sets.length > 0) {
      // Pre-render top 60 sets for instant edge performance
      const targetSets = sets.slice(0, 60);
      targetSets.forEach((set: any) => {
        if (set && set.id) {
          publicRoutes.push({
            route: `/set/${set.id}`,
            outputPath: path.join(distDir, 'set', set.id, 'index.html')
          });
          publicRoutes.push({
            route: `/set/${set.id}/top-cards`,
            outputPath: path.join(distDir, 'set', set.id, 'top-cards', 'index.html')
          });
        }
      });
    }
  } catch (err) {
    console.warn('[Prerender] Failed to fetch expansions for static routing:', err);
  }

  // Generate complete titanium footprint (sitemaps, RSS feed, LLMs.txt, robots.txt)
  try {
    console.log('[Prerender] Generating dynamic titanium public footprint...');
    await writeAllFootprintFiles(distDir);
    await writeAllFootprintFiles(path.join(process.cwd(), 'public'));
  } catch (footprintErr) {
    console.error('[Prerender] Failed to generate footprint files:', footprintErr);
  }

  console.log(`[Prerender] Generating static HTML for ${publicRoutes.length} public routes...`);

  for (const { route, outputPath } of publicRoutes) {
    try {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const ssrResult = await renderSsrRoute(route, {}, 'deckdivider.app');
      const renderedHtml = injectSsrIntoTemplate(rawTemplate, ssrResult, true);

      fs.writeFileSync(outputPath, renderedHtml, 'utf-8');
    } catch (err) {
      console.error(`[Prerender] ✗ Failed generating static HTML for route ${route}:`, err);
    }
  }

  console.log(`[Prerender] ✓ Static HTML pre-rendering complete for ${publicRoutes.length} routes.`);

  // Ping IndexNow with ALL public URLs (pushed-update dynamisation)
  try {
    const allPublicUrls = await getAllPublicUrls();
    console.log(`[Prerender] Submitting ${allPublicUrls.length} public footprint URLs to IndexNow...`);
    const indexResults = await pingIndexNow(allPublicUrls);
    const totalSubmitted = indexResults.reduce((acc, curr) => acc + curr.count, 0);
    const hasSuccess = indexResults.some(r => r.success);
    if (hasSuccess) {
      console.log(`[Prerender] ✓ IndexNow successfully notified for ${totalSubmitted} URLs.`);
    } else {
      console.log(`[Prerender] ℹ IndexNow submission ready (${totalSubmitted} URLs). Domain key active for verification.`);
    }
  } catch (indexNowErr) {
    console.info('[Prerender] IndexNow notice (safe to ignore if offline):', indexNowErr);
  }
}

prerenderAllRoutes().catch((err) => {
  console.error('[Prerender Fatal]', err);
  process.exit(1);
});
