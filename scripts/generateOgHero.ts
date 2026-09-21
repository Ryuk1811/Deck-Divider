import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

export async function generateOgHeroImage() {
  const width = 1200;
  const height = 630;
  const publicDir = path.resolve(process.cwd(), 'public');
  const distDir = path.resolve(process.cwd(), 'dist');
  const ogHeroPublicPath = path.join(publicDir, 'og-hero.png');
  const ogImagePublicPath = path.join(publicDir, 'og-image.png');

  // Skip Puppeteer in Cloudflare Pages CI or if pre-generated assets are already present
  const isCloudflarePages = process.env.CF_PAGES === '1' || process.env.CF_PAGES_COMMIT_SHA;
  const shouldSkip = isCloudflarePages || process.env.SKIP_PUPPETEER === 'true' || (!process.env.FORCE_OG_GEN && fs.existsSync(ogHeroPublicPath) && fs.existsSync(ogImagePublicPath));

  if (shouldSkip) {
    console.log('[OG Generator] Using pre-generated high-fidelity Hero OG Image (Cloudflare CI / static cache).');
    if (fs.existsSync(distDir)) {
      if (fs.existsSync(ogHeroPublicPath)) fs.copyFileSync(ogHeroPublicPath, path.join(distDir, 'og-hero.png'));
      if (fs.existsSync(ogImagePublicPath)) fs.copyFileSync(ogImagePublicPath, path.join(distDir, 'og-image.png'));
    }
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@600;700;800&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #FAFAFC;
      background-image: radial-gradient(#CBD5E1 1.2px, transparent 1.2px);
      background-size: 24px 24px;
      color: #0F172A;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px 44px 32px 44px;
    }

    /* Top Navigation Bar */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      z-index: 50;
      position: relative;
    }

    .brand-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-pill {
      display: flex;
      align-items: center;
      background-color: #0B0F19;
      padding: 6px 14px;
      border-radius: 9999px;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 15px;
      letter-spacing: -0.3px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .brand-slash {
      color: #DC143C;
      margin: 0 4px;
    }

    .pages-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    }

    .pages-count {
      color: #94A3B8;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
    }

    /* Floating Background Slabs */
    .slab-stage {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .slab {
      position: absolute;
      width: 200px;
      height: 300px;
      background: rgba(255, 255, 255, 0.96);
      border-radius: 16px;
      padding: 10px;
      border: 1px solid rgba(226, 232, 240, 0.95);
      box-shadow: 0 16px 36px -6px rgba(15, 23, 42, 0.14), 0 6px 16px -2px rgba(15, 23, 42, 0.08);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Left PSA Slab */
    .slab-left {
      left: 140px;
      top: 85px;
      transform: rotate(-8deg);
      opacity: 0.92;
    }

    .psa-header {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 7px;
      padding: 5px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .psa-stripe {
      height: 7px;
      width: 60px;
      background: rgba(220, 20, 60, 0.25);
      border-radius: 4px;
    }

    .psa-grade {
      background: #DC143C;
      color: #FFFFFF;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .slab-inner-card {
      flex: 1;
      margin: 8px 0;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      position: relative;
    }

    .card-icon-box {
      width: 44px;
      height: 44px;
      background: rgba(226, 232, 240, 0.7);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94A3B8;
    }

    .card-placeholder-line {
      height: 6px;
      background: #CBD5E1;
      border-radius: 3px;
    }

    .slab-footer {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: 6px;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Middle Pristine Slab */
    .slab-center {
      left: 500px;
      top: 60px;
      transform: translateX(-50%) rotate(0deg);
      opacity: 0.85;
      width: 190px;
      height: 290px;
    }

    .cgc-header {
      background: #090D16;
      border: 1px solid rgba(251, 191, 36, 0.4);
      border-radius: 7px;
      padding: 5px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .cgc-badge {
      background: rgba(251, 191, 36, 0.2);
      border: 1px solid rgba(251, 191, 36, 0.4);
      color: #FCD34D;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      font-weight: 800;
      padding: 2px 5px;
      border-radius: 4px;
    }

    /* Right BGS Slab */
    .slab-right {
      right: 140px;
      top: 90px;
      transform: rotate(8.5deg);
      opacity: 0.92;
    }

    .bgs-header {
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: 7px;
      padding: 5px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .bgs-grade {
      background: rgba(245, 158, 11, 0.2);
      color: #B45309;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .bgs-subgrades {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7px;
      color: #64748B;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    /* Foreground Hero Content */
    .hero-container {
      position: relative;
      z-index: 20;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-top: 10px;
      margin-bottom: 6px;
    }

    .tagline-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      padding: 4px 14px;
      border-radius: 9999px;
      color: #DC143C;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      margin-bottom: 12px;
    }

    .tagline-dot {
      width: 6px;
      height: 6px;
      background: #DC143C;
      border-radius: 50%;
    }

    .hero-title {
      font-size: 68px;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -2px;
      color: #0F172A;
      max-width: 820px;
      margin-bottom: 14px;
    }

    .hero-subtitle {
      font-size: 14.5px;
      line-height: 1.55;
      color: #475569;
      max-width: 840px;
      margin-bottom: 18px;
      font-weight: 400;
    }

    .chips-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 22px;
    }

    .chip {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      color: #334155;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
    }

    .chip-icon {
      color: #16A34A;
      width: 14px;
      height: 14px;
    }

    .buttons-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #DC143C;
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 800;
      padding: 10px 22px;
      border-radius: 12px;
      box-shadow: 0 6px 18px rgba(220, 20, 60, 0.28);
    }

    .btn-secondary {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      color: #0F172A;
      font-size: 13px;
      font-weight: 700;
      padding: 10px 18px;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    }

    .btn-tertiary {
      display: flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      color: #64748B;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 14px;
    }
  </style>
</head>
<body>

  <!-- Top Navigation -->
  <div class="topbar">
    <div class="brand-container">
      <!-- Deck / divider icon -->
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="14" width="22" height="22" rx="4" fill="#FBBF24" transform="rotate(-10 6 14)" />
        <rect x="10" y="10" width="22" height="22" rx="4" fill="#38BDF8" transform="rotate(5 10 10)" />
        <rect x="14" y="6" width="22" height="22" rx="4" fill="#DC143C" />
      </svg>
      <div class="brand-pill">
        <span>DECK</span>
        <span class="brand-slash">/</span>
        <span style="font-weight: 500; color: #CBD5E1;">divider</span>
      </div>
    </div>

    <div class="pages-pill">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC143C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      </svg>
      <span>Pages</span>
      <span class="pages-count">27</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>
  </div>

  <!-- Tri-Slab Ambient Collector Stage -->
  <div class="slab-stage">
    <!-- SLAB 1: Left PSA 10 -->
    <div class="slab slab-left">
      <div class="psa-header">
        <div class="psa-stripe"></div>
        <div class="psa-grade">10</div>
      </div>
      <div class="slab-inner-card">
        <div class="card-icon-box">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
        </div>
        <div class="card-placeholder-line" style="width: 70px;"></div>
        <div class="card-placeholder-line" style="width: 45px; opacity: 0.6;"></div>
      </div>
      <div class="slab-footer">
        <div class="card-placeholder-line" style="width: 50px;"></div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; color: #16A34A;">$***.**</div>
      </div>
    </div>

    <!-- SLAB 2: Middle CGC Pristine -->
    <div class="slab slab-center">
      <div class="cgc-header">
        <div style="display: flex; align-items: center; gap: 4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2">
            <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.202a1 1 0 0 1-.96.733H5.813a1 1 0 0 1-.96-.733L2.019 6.019a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/>
          </svg>
          <div style="width: 40px; height: 5px; background: rgba(251, 191, 36, 0.3); border-radius: 3px;"></div>
        </div>
        <div class="cgc-badge">PRISTINE</div>
      </div>
      <div class="slab-inner-card">
        <div class="card-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <div class="card-placeholder-line" style="width: 60px;"></div>
      </div>
      <div class="slab-footer">
        <div class="card-placeholder-line" style="width: 40px;"></div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 700; color: #D97706;">POP 1</div>
      </div>
    </div>

    <!-- SLAB 3: Right BGS 9.5 -->
    <div class="slab slab-right">
      <div class="bgs-header">
        <div style="display: flex; align-items: center; gap: 4px;">
          <div style="width: 6px; height: 6px; border-radius: 50%; background: #D97706;"></div>
          <div style="width: 50px; height: 5px; background: rgba(217, 119, 6, 0.3); border-radius: 3px;"></div>
        </div>
        <div class="bgs-grade">9.5</div>
      </div>
      <div class="slab-inner-card">
        <div class="card-icon-box">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
        </div>
        <div class="card-placeholder-line" style="width: 70px;"></div>
        <div class="card-placeholder-line" style="width: 40px; opacity: 0.6;"></div>
      </div>
      <div class="slab-footer">
        <div class="bgs-subgrades">
          <span>C:9.5</span>
          <span>S:10</span>
          <span>E:9.5</span>
          <span>C:9.5</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Center Foreground Content -->
  <div class="hero-container">
    <div class="tagline-pill">
      <div class="tagline-dot"></div>
      <span>POKÉMON TCG COLLECTION TRACKER & DECK STUDIO</span>
    </div>

    <h1 class="hero-title">
      Grade it. Price it. Play it.
    </h1>

    <p class="hero-subtitle">
      Log raw cards and graded certs, complete master sets, track live TCGplayer prices, and build tournament-legal 60-card decks for PTCGL. Connect with the global community of collectors and players, analyze meta trends in real-time, and manage your entire sealed portfolio securely in one unified platform designed for the ultimate Pokémon TCG enthusiast.
    </p>

    <!-- Proof Chips -->
    <div class="chips-row">
      <div class="chip">
        <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>PSA, BGS & CGC Slab Certs</span>
      </div>

      <div class="chip">
        <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>Live TCGplayer Market Comps</span>
      </div>

      <div class="chip">
        <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>Standard 60-Card Deck Legality</span>
      </div>

      <div class="chip">
        <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>Advanced Sealed Portfolio Tracking</span>
      </div>
    </div>

    <!-- Buttons Row -->
    <div class="buttons-row">
      <div class="btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FDE047" stroke="#FDE047" stroke-width="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        <span>Start Your Collection</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>

      <div class="btn-secondary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC143C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        <span>Sign In / Login</span>
      </div>

      <div class="btn-tertiary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
        <span>Explore Features</span>
      </div>
    </div>
  </div>

</body>
</html>
`;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
    ],
    defaultViewport: {
      width,
      height,
      deviceScaleFactor: 2, // 2x retina render for razor-sharp crisp typography
    },
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'load', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 600));

  const highResScreenshotBuffer = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width, height },
  });

  await browser.close();

  // Resize / compress to standard 1200x630 PNG optimized for social link previews (WhatsApp, Twitter, LinkedIn, Discord)
  const outputPngBuffer = await sharp(highResScreenshotBuffer)
    .resize(width, height)
    .png({ compressionLevel: 9, quality: 95 })
    .toBuffer();

  fs.writeFileSync(ogHeroPublicPath, outputPngBuffer);
  fs.writeFileSync(ogImagePublicPath, outputPngBuffer);

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'og-hero.png'), outputPngBuffer);
    fs.writeFileSync(path.join(distDir, 'og-image.png'), outputPngBuffer);
  }

  console.log(`[OG Generator] Successfully generated 1200x630 Hero OG Image:`);
  console.log(`  File size: ${(outputPngBuffer.length / 1024).toFixed(1)} KB`);
  console.log(`  Saved to: public/og-image.png & public/og-hero.png`);
}

if (process.argv[1] && (process.argv[1].includes('generateOgHero') || process.argv[1].endsWith('generateOgHero.ts'))) {
  generateOgHeroImage().catch(console.error);
}
