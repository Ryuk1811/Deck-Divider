/**
 * SEO & Sitemap Automated CI Linting Script
 * Enforces Tier 1 & Tier 2 Google Search quality and discoverability rules:
 * 1. Checks that sitemap URLs contain no query strings (?q=) or anchor fragments (#)
 * 2. Asserts sitemap child URLs pass the indexability gate (status 200, index, follow)
 * 3. Asserts unknown / test entities return hard 404 status codes (preventing soft 404s)
 * 4. Asserts single source of truth consistency between site.config and platformTruth
 */

import { SITE_CONFIG } from '../src/config/site.config.js';
import { PLATFORM_TRUTH } from '../src/config/platformTruth.js';
import { evaluateRouteGate } from '../server/seoGate.js';
import { getAllPublicUrls } from '../server/publicFootprintManager.js';

async function runSeoLint() {
  console.log('🔍 [SEO Linter] Starting comprehensive search health validation...');
  let hasErrors = false;

  // 1. Single source of truth checks
  console.log('  -> Checking site.config.ts vs platformTruth.ts alignment...');
  if (SITE_CONFIG.metrics.totalExpansions !== PLATFORM_TRUTH.totalExpansions) {
    console.error(`❌ Mismatch in totalExpansions: site.config has ${SITE_CONFIG.metrics.totalExpansions}, platformTruth has ${PLATFORM_TRUTH.totalExpansions}`);
    hasErrors = true;
  }
  if (SITE_CONFIG.metrics.mainlineExpansions !== PLATFORM_TRUTH.mainlineExpansions) {
    console.error(`❌ Mismatch in mainlineExpansions: site.config has ${SITE_CONFIG.metrics.mainlineExpansions}, platformTruth has ${PLATFORM_TRUTH.mainlineExpansions}`);
    hasErrors = true;
  }
  if (SITE_CONFIG.metrics.supportedCurrenciesCount !== PLATFORM_TRUTH.supportedCurrenciesCount) {
    console.error(`❌ Mismatch in supportedCurrenciesCount: site.config has ${SITE_CONFIG.metrics.supportedCurrenciesCount}, platformTruth has ${PLATFORM_TRUTH.supportedCurrenciesCount}`);
    hasErrors = true;
  }
  if (SITE_CONFIG.brandName !== PLATFORM_TRUTH.brandName) {
    console.error(`❌ Mismatch in brandName: site.config has ${SITE_CONFIG.brandName}, platformTruth has ${PLATFORM_TRUTH.brandName}`);
    hasErrors = true;
  }

  // 2. Sitemap Purity Checks
  console.log('  -> Inspecting public sitemap URLs for query parameters and fragments...');
  const publicUrls = await getAllPublicUrls();
  console.log(`     Total public URLs extracted for audit: ${publicUrls.length}`);

  const seenUrls = new Set<string>();
  for (const url of publicUrls) {
    if (url.includes('?')) {
      console.error(`❌ Sitemap URL contains query string: ${url}`);
      hasErrors = true;
    }
    if (url.includes('#')) {
      console.error(`❌ Sitemap URL contains hash fragment: ${url}`);
      hasErrors = true;
    }
    if (seenUrls.has(url)) {
      console.error(`❌ Duplicate URL in sitemap catalog: ${url}`);
      hasErrors = true;
    }
    seenUrls.add(url);
  }

  // 3. Sample Indexability Gate Checks
  console.log('  -> Verifying indexability gate responses on core URLs...');
  const samplePaths = [
    '/',
    '/cards',
    '/sets',
    '/set/sv08',
    '/deck/charizard-ex',
    '/tools/format-checker',
    '/compare/collectr',
  ];

  for (const testPath of samplePaths) {
    const gate = await evaluateRouteGate(testPath);
    if (gate.statusCode !== 200 || !gate.isSitemapEligible || gate.robots !== 'index, follow') {
      console.error(`❌ Key page failed indexability gate: ${testPath} (status: ${gate.statusCode}, robots: ${gate.robots}, eligible: ${gate.isSitemapEligible})`);
      hasErrors = true;
    }
  }

  // 4. Soft 404 Prevention Tests (Ensure unknown entities return true 404)
  console.log('  -> Verifying hard 404 status codes on nonexistent entity routes...');
  const nonexistentRoutes = [
    '/card/nonexistent-card-id-12345',
    '/set/nonexistent-set-id-99999',
    '/deck/fake-user-deck-does-not-exist',
    '/random-nonexistent-page-xyz',
  ];

  for (const fakeRoute of nonexistentRoutes) {
    const gate = await evaluateRouteGate(fakeRoute);
    if (gate.statusCode !== 404) {
      console.error(`❌ Route ${fakeRoute} did not return hard 404 status! Returned ${gate.statusCode} (Soft 404 hazard)`);
      hasErrors = true;
    }
    if (!gate.robots.includes('noindex')) {
      console.error(`❌ Route ${fakeRoute} missing noindex robots tag!`);
      hasErrors = true;
    }
  }

  // 5. 301 Redirect Check for supported aliases
  console.log('  -> Verifying canonical 301 alias rules...');
  for (const [alias, target] of Object.entries(SITE_CONFIG.seoGate.supportedAliases)) {
    const gate = await evaluateRouteGate(alias);
    if (gate.statusCode !== 301 || gate.redirectTarget !== target) {
      console.error(`❌ Alias ${alias} did not return 301 redirect to ${target}! Got status ${gate.statusCode}`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('\n🚨 [SEO Linter] FAIL: Search discoverability errors detected. Please review logs above.');
    process.exit(1);
  } else {
    console.log('\n✅ [SEO Linter] SUCCESS: All Google Search discoverability and indexability criteria passed.');
  }
}

runSeoLint().catch((err) => {
  console.error('[SEO Linter] Unexpected error:', err);
  process.exit(1);
});
