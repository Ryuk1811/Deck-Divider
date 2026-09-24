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

  // Ensure all icons in dist match the clean public icons
  try {
    const iconFiles = [
      'favicon.ico',
      'favicon-16x16.png',
      'favicon-32x32.png',
      'favicon-48x48.png',
      'favicon.png',
      'apple-touch-icon.png',
      'apple-touch-icon-precomposed.png',
      'icon-192.png',
      'icon-google-192.png',
      'icon-512.png',
      'logo.png'
    ];
    for (const icon of iconFiles) {
      const srcPath = path.resolve(process.cwd(), 'public', icon);
      const destPath = path.join(distDir, icon);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  } catch (e) {
    console.warn('[Prerender] Notice: Icon copy sync', e);
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
  // Aligning entirely with the Phase 1 React Router rewrite (Singular domains)
  const publicRoutes: Array<{ route: string; outputPath: string }> = [
    { route: '/', outputPath: path.join(distDir, 'index.html') },
    { route: '/cards', outputPath: path.join(distDir, 'cards', 'index.html') },
    { route: '/expansions', outputPath: path.join(distDir, 'expansions', 'index.html') },
    { route: '/expansions/sets', outputPath: path.join(distDir, 'expansions', 'sets', 'index.html') },
    { route: '/directory', outputPath: path.join(distDir, 'directory', 'index.html') },
    { route: '/directory/sets-index', outputPath: path.join(distDir, 'directory', 'sets-index', 'index.html') },
    { route: '/directory/decks-index', outputPath: path.join(distDir, 'directory', 'decks-index', 'index.html') },
    { route: '/directory/slabs-index', outputPath: path.join(distDir, 'directory', 'slabs-index', 'index.html') },
    { route: '/directory/glossary', outputPath: path.join(distDir, 'directory', 'glossary', 'index.html') },
    { route: '/pricing', outputPath: path.join(distDir, 'pricing', 'index.html') },
    { route: '/sets', outputPath: path.join(distDir, 'sets', 'index.html') },
    { route: '/leaderboard', outputPath: path.join(distDir, 'leaderboard', 'index.html') },
    { route: '/about', outputPath: path.join(distDir, 'about', 'index.html') },
    { route: '/how-it-works', outputPath: path.join(distDir, 'how-it-works', 'index.html') },
    { route: '/privacy', outputPath: path.join(distDir, 'privacy', 'index.html') },
    { route: '/terms', outputPath: path.join(distDir, 'terms', 'index.html') },
    { route: '/security', outputPath: path.join(distDir, 'security', 'index.html') },
    { route: '/contact', outputPath: path.join(distDir, 'contact', 'index.html') },
    { route: '/faq', outputPath: path.join(distDir, 'faq', 'index.html') },
    { route: '/socials', outputPath: path.join(distDir, 'socials', 'index.html') },
    { route: '/changelog', outputPath: path.join(distDir, 'changelog', 'index.html') },
    
    // Formats & Legality
    { route: '/formats', outputPath: path.join(distDir, 'formats', 'index.html') },
    { route: '/format/standard', outputPath: path.join(distDir, 'format', 'standard', 'index.html') },
    { route: '/format/expanded', outputPath: path.join(distDir, 'format', 'expanded', 'index.html') },
    { route: '/format/glc', outputPath: path.join(distDir, 'format', 'glc', 'index.html') },

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

    // High Intent Utility Tools (Canonical /tools/)
    { route: '/tools', outputPath: path.join(distDir, 'tools', 'index.html') },
    { route: '/tools/psa-grade-calculator', outputPath: path.join(distDir, 'tools', 'psa-grade-calculator', 'index.html') },
    { route: '/tools/deck-legality-checker', outputPath: path.join(distDir, 'tools', 'deck-legality-checker', 'index.html') },

    // Programmatic Tournament Deck Archetypes (Singular)
    { route: '/deck/gardevoir-ex', outputPath: path.join(distDir, 'deck', 'gardevoir-ex', 'index.html') },
    { route: '/deck/charizard-ex', outputPath: path.join(distDir, 'deck', 'charizard-ex', 'index.html') },
    { route: '/deck/regidrago-vstar', outputPath: path.join(distDir, 'deck', 'regidrago-vstar', 'index.html') },
    { route: '/deck/dragapult-ex', outputPath: path.join(distDir, 'deck', 'dragapult-ex', 'index.html') },
    { route: '/deck/miraidon-ex', outputPath: path.join(distDir, 'deck', 'miraidon-ex', 'index.html') },
    { route: '/deck/lugia-vstar', outputPath: path.join(distDir, 'deck', 'lugia-vstar', 'index.html') },
    { route: '/deck/raging-bolt-ex', outputPath: path.join(distDir, 'deck', 'raging-bolt-ex', 'index.html') },
    { route: '/deck/terapagos-ex', outputPath: path.join(distDir, 'deck', 'terapagos-ex', 'index.html') },
    { route: '/deck/gholdengo-ex', outputPath: path.join(distDir, 'deck', 'gholdengo-ex', 'index.html') },
    { route: '/deck/roaring-moon-ex', outputPath: path.join(distDir, 'deck', 'roaring-moon-ex', 'index.html') },
    { route: '/deck/iron-thorns-ex', outputPath: path.join(distDir, 'deck', 'iron-thorns-ex', 'index.html') },
    { route: '/deck/pao-chien-ex', outputPath: path.join(distDir, 'deck', 'pao-chien-ex', 'index.html') },
    { route: '/deck/snorlax-stall', outputPath: path.join(distDir, 'deck', 'snorlax-stall', 'index.html') },
    { route: '/deck/ancient-box', outputPath: path.join(distDir, 'deck', 'ancient-box', 'index.html') },
    { route: '/deck/dialga-vstar', outputPath: path.join(distDir, 'deck', 'dialga-vstar', 'index.html') },
    { route: '/deck/giratina-vstar', outputPath: path.join(distDir, 'deck', 'giratina-vstar', 'index.html') },
  ];

  console.log('[Prerender] Fetching TCG Expansions for dynamic static generation...');
  try {
    const sets = await getExpansions();
    if (sets && sets.length > 0) {
      // Pre-render the top 100 historical sets and top-card views at build time. 
      // The rest are caught by Cloudflare Pages wildcard fallback.
      const targetSets = sets.slice(0, 100);
      targetSets.forEach((set: any) => {
        if (set.id) {
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
    console.warn('[Prerender] Warning: Could not fetch expansions for SSG.', err);
  }

  // 3. Guarantee XML Sitemaps, Robots, LLMs txt are dropped in BOTH dist and public
  console.log('[Prerender] Generating dynamic titanium public footprint...');
  const publicDir = path.resolve(process.cwd(), 'public');
  await writeAllFootprintFiles(distDir);
  await writeAllFootprintFiles(publicDir);

  // 4. Heavy Static Pre-rendering execution
  console.log(`[Prerender] Generating static HTML for ${publicRoutes.length} public routes...`);

  for (const { route, outputPath } of publicRoutes) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      const ssrResult = await renderSsrRoute(route);
      let injectedHtml = injectSsrIntoTemplate(rawTemplate, ssrResult, true);

      // Force hydration logic to understand it's a prerendered static page payload
      injectedHtml = injectedHtml.replace(
        '</body>',
        '<script>window.__STATIC_PRERENDER__ = true;</script></body>'
      );

      fs.writeFileSync(outputPath, injectedHtml, 'utf-8');
    } catch (err) {
      console.warn(`[Prerender] Skipped route ${route} due to error:`, err);
    }
  }

  console.log(`[Prerender] ✓ Static HTML pre-rendering complete for ${publicRoutes.length} routes.`);

  // Write static HTML 301/refresh redirects for legacy /tool/ URLs
  const legacyToolRedirects = [
    { from: 'psa-grade-calculator', to: '/tools/psa-grade-calculator' },
    { from: 'deck-legality-checker', to: '/tools/deck-legality-checker' },
  ];
  for (const item of legacyToolRedirects) {
    const redirectDir = path.join(distDir, 'tool', item.from);
    fs.mkdirSync(redirectDir, { recursive: true });
    fs.writeFileSync(
      path.join(redirectDir, 'index.html'),
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Redirecting...</title><link rel="canonical" href="https://deckdivider.app${item.to}"><meta http-equiv="refresh" content="0; url=${item.to}"></head><body><p>Redirecting to <a href="${item.to}">${item.to}</a>...</p></body></html>`,
      'utf-8'
    );
  }

  // 5. Bing/Yandex IndexNow Submission (Proactive Discovery)
  try {
    const allUrls = await getAllPublicUrls();
    console.log(`[Prerender] Submitting ${allUrls.length} public footprint URLs to IndexNow...`);
    await pingIndexNow(allUrls);
  } catch(e) {
    console.warn(`[Prerender] IndexNow notice: Domain must be live on https://deckdivider.app before API fully accepts submissions.`);
  }

  console.log('[Prerender] ✓ Prerender pipeline completed successfully.');
  process.exit(0);
}

prerenderAllRoutes().catch((err) => {
  console.error('[Prerender] Fatal error:', err);
  process.exit(1);
});
