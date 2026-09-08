import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function generateOgHeroImage() {
  const width = 1200;
  const height = 630;

  const artworkPath = path.resolve(process.cwd(), 'src/assets/images/hero_preview_art_1788872441833.jpg');
  let artworkBuffer: Buffer | null = null;
  if (fs.existsSync(artworkPath)) {
    // Resize and crop the 3D artwork to fit the right half with a gentle aspect
    artworkBuffer = await sharp(artworkPath)
      .resize(580, 520, { fit: 'cover', position: 'center' })
      .toBuffer();
  }

  // Create rounded mask for the artwork with subtle inner border
  const roundedArtSvg = `
  <svg width="560" height="490">
    <rect x="0" y="0" width="560" height="490" rx="20" ry="20" fill="#ffffff" />
  </svg>`;

  let maskedArtworkBuffer: Buffer | null = null;
  if (artworkBuffer) {
    const resizedArtwork = await sharp(artworkBuffer)
      .resize(560, 490, { fit: 'cover' })
      .toBuffer();

    maskedArtworkBuffer = await sharp(resizedArtwork)
      .composite([
        {
          input: Buffer.from(roundedArtSvg),
          blend: 'dest-in',
        },
      ])
      .png()
      .toBuffer();
  }

  // Generate SVG layout overlay
  const svgOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background Gradients -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090D16" />
        <stop offset="50%" stop-color="#0F172A" />
        <stop offset="100%" stop-color="#070A11" />
      </linearGradient>

      <radialGradient id="redGlow" cx="20%" cy="30%" r="50%">
        <stop offset="0%" stop-color="#DC143C" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#DC143C" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="emeraldGlow" cx="80%" cy="40%" r="45%">
        <stop offset="0%" stop-color="#10B981" stop-opacity="0.14" />
        <stop offset="100%" stop-color="#10B981" stop-opacity="0" />
      </radialGradient>

      <!-- Pattern for subtle dot grid -->
      <pattern id="dotGrid" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.2" fill="#334155" opacity="0.45" />
      </pattern>

      <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#DC143C" />
        <stop offset="100%" stop-color="#E11D48" />
      </linearGradient>

      <linearGradient id="cardFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.4" />
        <stop offset="50%" stop-color="#DC143C" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#10B981" stop-opacity="0.3" />
      </linearGradient>

      <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.6" />
      </filter>
    </defs>

    <!-- Base Canvas Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
    <rect width="${width}" height="${height}" fill="url(#redGlow)" />
    <rect width="${width}" height="${height}" fill="url(#emeraldGlow)" />
    <rect width="${width}" height="${height}" fill="url(#dotGrid)" />

    <!-- Top Border Line -->
    <line x1="0" y1="0" x2="${width}" y2="0" stroke="#DC143C" stroke-width="4" />

    <!-- Brand Header -->
    <g transform="translate(64, 60)">
      <!-- Logo Mark -->
      <rect x="0" y="0" width="36" height="36" rx="8" fill="#DC143C" />
      <path d="M9 10 L27 10 L27 26 L9 26 Z" fill="none" stroke="#FFFFFF" stroke-width="2.5" rx="2" />
      <line x1="12" y1="18" x2="24" y2="18" stroke="#FDE047" stroke-width="2" />
      
      <!-- Brand Name -->
      <text x="48" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" fill="#F8FAFC" letter-spacing="-0.5">DECK <tspan fill="#DC143C">/</tspan> divider</text>
      
      <!-- PRO Badge -->
      <rect x="230" y="7" width="46" height="22" rx="6" fill="#FFF0F3" stroke="#FDA4AF" stroke-width="1" />
      <text x="241" y="22" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="800" fill="#DC143C">PRO</text>
    </g>

    <!-- Hero Tagline Pill Badge -->
    <g transform="translate(64, 126)">
      <rect x="0" y="0" width="440" height="30" rx="15" fill="#1E293B" stroke="#334155" stroke-width="1.2" />
      <circle cx="16" cy="15" r="4.5" fill="#DC143C" />
      <circle cx="16" cy="15" r="7" fill="#DC143C" opacity="0.35" />
      <text x="32" y="20" font-family="'JetBrains Mono', -apple-system, monospace" font-size="11" font-weight="700" fill="#F43F5E" letter-spacing="1">POKÉMON TCG COLLECTION TRACKER &amp; DECK STUDIO</text>
    </g>

    <!-- Main Hero Headline -->
    <g transform="translate(64, 195)">
      <text x="0" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" fill="#FFFFFF" letter-spacing="-1.5">Grade it. Price it.</text>
      <text x="0" y="104" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" fill="#DC143C" letter-spacing="-1.5">Play it.</text>
    </g>

    <!-- Subtitle -->
    <g transform="translate(64, 335)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="400" fill="#94A3B8" line-height="1.5">
        <tspan x="0" dy="0">Track cards, PSA/BGS slabs, and sealed booster boxes</tspan>
        <tspan x="0" dy="25">with live TCGplayer prices. Build standard 60-card tournament</tspan>
        <tspan x="0" dy="25">decks and complete master sets with zero ads.</tspan>
      </text>
    </g>

    <!-- Feature Proof Chips -->
    <g transform="translate(64, 442)">
      <!-- Chip 1: Slabs -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="168" height="34" rx="17" fill="#1E293B" stroke="#334155" stroke-width="1" />
        <circle cx="17" cy="17" r="7" fill="#10B981" />
        <path d="M14 17 L16 19 L20 15" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        <text x="32" y="22" font-family="-apple-system, sans-serif" font-size="12" font-weight="600" fill="#E2E8F0">PSA &amp; BGS Slabs</text>
      </g>

      <!-- Chip 2: Market Comps -->
      <g transform="translate(178, 0)">
        <rect x="0" y="0" width="180" height="34" rx="17" fill="#1E293B" stroke="#334155" stroke-width="1" />
        <circle cx="17" cy="17" r="7" fill="#10B981" />
        <path d="M14 17 L16 19 L20 15" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        <text x="32" y="22" font-family="-apple-system, sans-serif" font-size="12" font-weight="600" fill="#E2E8F0">Live TCGplayer Comps</text>
      </g>

      <!-- Chip 3: Legality -->
      <g transform="translate(368, 0)">
        <rect x="0" y="0" width="162" height="34" rx="17" fill="#1E293B" stroke="#334155" stroke-width="1" />
        <circle cx="17" cy="17" r="7" fill="#10B981" />
        <path d="M14 17 L16 19 L20 15" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        <text x="32" y="22" font-family="-apple-system, sans-serif" font-size="12" font-weight="600" fill="#E2E8F0">60-Card Legality</text>
      </g>
    </g>

    <!-- Bottom CTA Button & Badge -->
    <g transform="translate(64, 508)">
      <rect x="0" y="0" width="200" height="46" rx="12" fill="url(#btnGrad)" />
      <!-- Zap Icon -->
      <path d="M22 23 L28 14 L24 23 L30 23 L20 34 L23 26 Z" fill="#FDE047" />
      <text x="38" y="29" font-family="-apple-system, sans-serif" font-size="15" font-weight="800" fill="#FFFFFF">Launch Studio</text>
      <!-- Arrow -->
      <path d="M166 23 L174 23 M170 19 L174 23 L170 27" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Supporting Stats Badge -->
      <rect x="220" y="0" width="230" height="46" rx="12" fill="#0F172A" stroke="#334155" stroke-width="1" />
      <text x="236" y="20" font-family="-apple-system, sans-serif" font-size="11" font-weight="600" fill="#94A3B8">TRACKED LIVE IN 15+ CURRENCIES</text>
      <text x="236" y="36" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#38BDF8">USD • EUR • JPY • GBP • CAD</text>
    </g>

    <!-- Right Side Mockup Outer Container Frame -->
    <g transform="translate(594, 68)" filter="url(#cardShadow)">
      <rect x="0" y="0" width="564" height="494" rx="22" ry="22" fill="none" stroke="url(#cardFrameGrad)" stroke-width="2" />
    </g>

    <!-- Floating UI Badge 1: PSA 10 Gem Mint Cert (Grade it) -->
    <g transform="translate(930, 88)">
      <rect x="0" y="0" width="206" height="38" rx="19" fill="#0F172A" stroke="#F59E0B" stroke-width="1.5" opacity="0.95" />
      <circle cx="20" cy="19" r="10" fill="#F59E0B" />
      <text x="20" y="23" font-family="'Liberation Sans', sans-serif" font-size="11" font-weight="900" fill="#0F172A" text-anchor="middle">★</text>
      <text x="38" y="24" font-family="'Liberation Sans', sans-serif" font-size="12" font-weight="800" fill="#FEF3C7" letter-spacing="0.5">PSA 10 GEM MINT</text>
    </g>

    <!-- Floating UI Badge 2: Live Market Value Comps (Price it) -->
    <g transform="translate(616, 470)">
      <rect x="0" y="0" width="248" height="66" rx="14" fill="#0B1120" stroke="#334155" stroke-width="1.2" opacity="0.96" />
      <text x="16" y="22" font-family="'Liberation Sans', sans-serif" font-size="10" font-weight="700" fill="#94A3B8" letter-spacing="0.5">PORTFOLIO MARKET VALUE</text>
      <text x="16" y="48" font-family="'Liberation Mono', monospace" font-size="20" font-weight="800" fill="#F8FAFC">$14,820.50</text>
      <rect x="160" y="32" width="76" height="22" rx="11" fill="#064E3B" stroke="#059669" stroke-width="1" />
      <text x="198" y="47" font-family="'Liberation Sans', sans-serif" font-size="11" font-weight="800" fill="#34D399" text-anchor="middle">▲ +18.4%</text>
    </g>

    <!-- Floating UI Badge 3: 60-Card Tournament Deck Legality (Play it) -->
    <g transform="translate(886, 496)">
      <rect x="0" y="0" width="248" height="40" rx="20" fill="#0F172A" stroke="#10B981" stroke-width="1.5" opacity="0.96" />
      <circle cx="20" cy="20" r="9" fill="#10B981" />
      <path d="M16 20 L19 23 L24 17" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <text x="38" y="25" font-family="'Liberation Sans', sans-serif" font-size="12" font-weight="800" fill="#E2E8F0">60/60 STANDARD LEGAL</text>
    </g>
  </svg>`;

  // Composite SVG and Artwork
  const compositeLayers: sharp.OverlayOptions[] = [];

  if (maskedArtworkBuffer) {
    compositeLayers.push({
      input: maskedArtworkBuffer,
      top: 70,
      left: 596,
    });
  }

  // Overlay the SVG typography and layout
  compositeLayers.push({
    input: Buffer.from(svgOverlay),
    top: 0,
    left: 0,
  });

  // Render to public/og-image.png and public/og-hero.png
  const finalImage = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 9, g: 13, b: 22, alpha: 1 },
    },
  }).composite(compositeLayers);

  const distDir = path.resolve(process.cwd(), 'dist');
  const publicDir = path.resolve(process.cwd(), 'public');

  const ogHeroPublicPath = path.join(publicDir, 'og-hero.png');
  const ogImagePublicPath = path.join(publicDir, 'og-image.png');

  // Generate PNG optimized for under 300KB (strict WhatsApp compatibility)
  const outputPngBuffer = await finalImage
    .png({ compressionLevel: 9, quality: 90 })
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
