import fs from 'fs';
import path from 'path';
import { renderSsrRoute, injectSsrIntoTemplate } from '../server/ssrRenderer.js';
import { getExpansions } from '../server/tcgCatalogManager.js';

import { pingIndexNow } from '../server/indexNow.js';

async function prerenderAllRoutes() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.warn('[Prerender] dist/index.html not found. Skipping static prerender.');
    return;
  }
  const rawTemplate = fs.readFileSync(templatePath, 'utf-8');

  const publicRoutes = [
    { route: '/', outputPath: path.join(distDir, 'index.html') },
    { route: '/pricing', outputPath: path.join(distDir, 'pricing', 'index.html') },
    { route: '/faq', outputPath: path.join(distDir, 'faq', 'index.html') },
    { route: '/about', outputPath: path.join(distDir, 'about', 'index.html') },
    { route: '/how-it-works', outputPath: path.join(distDir, 'how-it-works', 'index.html') },
    { route: '/privacy', outputPath: path.join(distDir, 'privacy', 'index.html') },
    { route: '/terms', outputPath: path.join(distDir, 'terms', 'index.html') },
    { route: '/auth', outputPath: path.join(distDir, 'auth', 'index.html') },
    { route: '/changelog', outputPath: path.join(distDir, 'changelog', 'index.html') },
    { route: '/sets', outputPath: path.join(distDir, 'sets', 'index.html') },
    // Programmatic Tournament Deck Archetypes
    { route: '/decks/gardevoir-ex', outputPath: path.join(distDir, 'decks', 'gardevoir-ex', 'index.html') },
    { route: '/decks/charizard-ex', outputPath: path.join(distDir, 'decks', 'charizard-ex', 'index.html') },
    { route: '/decks/regidrago-vstar', outputPath: path.join(distDir, 'decks', 'regidrago-vstar', 'index.html') },
    { route: '/decks/dragapult-ex', outputPath: path.join(distDir, 'decks', 'dragapult-ex', 'index.html') },
    { route: '/decks/miraidon-ex', outputPath: path.join(distDir, 'decks', 'miraidon-ex', 'index.html') },
    { route: '/formats', outputPath: path.join(distDir, 'formats', 'index.html') },
    { route: '/formats/standard', outputPath: path.join(distDir, 'formats', 'standard', 'index.html') },
    { route: '/formats/expanded', outputPath: path.join(distDir, 'formats', 'expanded', 'index.html') },
    { route: '/formats/glc', outputPath: path.join(distDir, 'formats', 'glc', 'index.html') },
    { route: '/compare/collectr', outputPath: path.join(distDir, 'compare', 'collectr', 'index.html') },
    { route: '/compare/pokellector', outputPath: path.join(distDir, 'compare', 'pokellector', 'index.html') },
    { route: '/compare/pricecharting', outputPath: path.join(distDir, 'compare', 'pricecharting', 'index.html') },
  ];

  try {
    console.log('[Prerender] Fetching TCG Expansions for dynamic static generation...');
    const sets = await getExpansions();
    if (Array.isArray(sets)) {
      const targetSets = sets.slice(0, 100);
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

  console.log(`[Prerender] Generating static HTML for public routes...`);

  for (const { route, outputPath } of publicRoutes) {
    try {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const ssrResult = await renderSsrRoute(route, {}, 'deckdivider.app');
      const renderedHtml = injectSsrIntoTemplate(rawTemplate, ssrResult, true);

      fs.writeFileSync(outputPath, renderedHtml, 'utf-8');
      console.log(`[Prerender] ✓ Successfully generated: ${route} -> ${path.relative(process.cwd(), outputPath)}`);
    } catch (err) {
      console.error(`[Prerender] ✗ Failed generating static HTML for route ${route}:`, err);
    }
  }

  console.log('[Prerender] Static HTML pre-rendering complete.');

  // Ping IndexNow with the prerendered URLs
  const urlsToPing = publicRoutes.map(r => `https://deckdivider.app${r.route}`);
  console.log('[Prerender] Pinging IndexNow with updated routes...');
  await pingIndexNow(urlsToPing);
}

prerenderAllRoutes().catch((err) => {
  console.error('[Prerender Fatal]', err);
  process.exit(1);
});
