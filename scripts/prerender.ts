import fs from 'fs';
import path from 'path';
import { renderSsrRoute, injectSsrIntoTemplate } from '../server/ssrRenderer.js';

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
  ];

  console.log('[Prerender] Generating static HTML for public routes...');

  for (const { route, outputPath } of publicRoutes) {
    try {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const ssrResult = await renderSsrRoute(route, {}, 'deckdivider.app');
      const renderedHtml = injectSsrIntoTemplate(rawTemplate, ssrResult);

      fs.writeFileSync(outputPath, renderedHtml, 'utf-8');
      console.log(`[Prerender] ✓ Successfully generated: ${route} -> ${path.relative(process.cwd(), outputPath)}`);
    } catch (err) {
      console.error(`[Prerender] ✗ Failed generating static HTML for route ${route}:`, err);
    }
  }

  console.log('[Prerender] Static HTML pre-rendering complete.');
}

prerenderAllRoutes().catch((err) => {
  console.error('[Prerender Fatal]', err);
  process.exit(1);
});
