import sharp from 'sharp';

export interface OgImageOptions {
  type?: 'deck' | 'set' | 'portfolio' | 'card' | 'general';
  title: string;
  subtitle?: string;
  badge?: string;
  metric1Label?: string;
  metric1Value?: string;
  metric2Label?: string;
  metric2Value?: string;
  metric3Label?: string;
  metric3Value?: string;
  tag?: string;
  theme?: 'light';
  colorHex?: string;
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Split text into max 2 lines that fit comfortably within the container
 */
function wrapTitle(text: string, maxCharsPerLine: number = 32): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length >= 2) break;
    }
  }
  if (currentLine && lines.length < 2) {
    lines.push(currentLine);
  }

  if (lines.length > 0 && lines[lines.length - 1].length > maxCharsPerLine) {
    lines[lines.length - 1] = lines[lines.length - 1].slice(0, maxCharsPerLine - 3) + '...';
  }

  return lines.length > 0 ? lines : [text];
}

/**
 * Generates an ultra-crisp, branded SVG OpenGraph card (1200 x 630 px)
 * strictly adhering to DECK / divider's signature light UI design language:
 * - Canvas: Pristine light slate background (#F8FAFC)
 * - Technical dotted canvas: Slate matrix dots (#CBD5E1) at 20px spacing
 * - Header: Iconic black pill mark (#0F172A) with white "DECK", crimson slash "/" (#DC143C), and white "divider"
 * - Breadcrumb: Crimson pill tag (bg #FFF1F2, border #FECDD3, text #DC143C)
 * - White Container Card: Pure white (#FFFFFF) with crisp border (#E2E8F0) and subtle soft elevation
 * - Red Dot Indicator: Crimson status dot (#DC143C)
 * - High-Contrast Typography: Dark slate headings (#0F172A), muted labels (#64748B)
 * - Public Badge: Native rose pill (bg #FFF1F2, border #FDA4AF, text #E11D48)
 * - Stats Row: Clean metric panels (#F8FAFC) with monospace figures
 * - Footer: Domain and live TCGplayer verification marks
 */
export function generateOgImageSvg(options: OgImageOptions): string {
  const type = options.type || 'deck';
  const rawTitle = options.title || (type === 'deck' ? 'Tournament Deck' : type === 'set' ? 'Pokémon Expansion' : 'Collector Vault');
  const subtitle = options.subtitle || (
    type === 'deck'
      ? 'Standard Format Legal • 60-Card Competitive Roster'
      : type === 'set'
      ? 'Pokémon TCG Expansion Checklist & Live Market Prices'
      : 'Verified Pokémon TCG Collection Showcase & Slab Vault'
  );

  const breadcrumbTag = type === 'deck' ? 'DECK COMMAND' : type === 'set' ? 'EXPANSION DIRECTORY' : 'PORTFOLIO VAULT';
  const breadcrumbSub = type === 'deck' ? 'Decks & Binder Studio' : type === 'set' ? 'Set Checklist' : 'Public Showcase';

  const m1Label = options.metric1Label || (type === 'deck' ? 'TOTAL CARDS' : type === 'set' ? 'TOTAL CARDS' : 'VAULT CARDS');
  const m1Value = options.metric1Value || (type === 'deck' ? '60 / 60' : type === 'set' ? 'Master Set' : 'Verified');

  const m2Label = options.metric2Label || (type === 'deck' ? 'ESTIMATED VALUE' : type === 'set' ? 'TCGPLAYER' : 'PORTFOLIO NAV');
  const m2Value = options.metric2Value || (type === 'deck' ? 'Market Value' : type === 'set' ? 'Live Prices' : 'Live Sync');

  const m3Label = options.metric3Label || (type === 'deck' ? 'FORMAT LEGALITY' : type === 'set' ? 'SERIES' : 'COLLECTOR STATUS');
  const m3Value = options.metric3Value || (type === 'deck' ? 'Standard Legal' : type === 'set' ? 'Pokémon TCG' : 'Public Showcase');

  const lines = wrapTitle(rawTitle, rawTitle.length > 36 ? 30 : 34);
  const isMultiLine = lines.length > 1;
  const titleY = isMultiLine ? 228 : 246;
  const titleLineHeight = 54;

  const accentColor = options.colorHex || '#DC143C';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <defs>
    <!-- Technical Dotted Matrix Canvas Pattern (Matches App Canvas) -->
    <pattern id="appDottedGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1.2" fill="#CBD5E1"/>
    </pattern>

    <!-- Subtle Clean Elevation Filter for Main White Card -->
    <filter id="cardShadow" x="-10%" y="-8%" width="120%" height="124%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.06"/>
      <feDropShadow dx="0" dy="1" stdDeviation="3" flood-color="#0F172A" flood-opacity="0.04"/>
    </filter>
  </defs>

  <!-- Base App Canvas (Light Slate #F8FAFC) -->
  <rect width="1200" height="630" fill="#F8FAFC"/>

  <!-- Signature Dotted Grid Background -->
  <rect width="1200" height="630" fill="url(#appDottedGrid)"/>

  <!-- Outer App Border Accent -->
  <rect x="20" y="20" width="1160" height="590" rx="20" fill="none" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- TOP BRANDING HEADER BAR -->
  <g transform="translate(60, 48)">
    <!-- Iconic DECK / divider Black Capsule Badge -->
    <rect x="0" y="0" width="170" height="38" rx="8" fill="#000000"/>
    <text x="22" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" letter-spacing="-0.3">
      DECK <tspan fill="#DC143C" font-weight="900">/</tspan> divider
    </text>

    <!-- Breadcrumb Crimson Tag (Matches In-App Header) -->
    <rect x="186" y="0" width="138" height="38" rx="8" fill="#FFF1F2" stroke="#FECDD3" stroke-width="1"/>
    <text x="255" y="24" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" font-weight="800" fill="#DC143C" letter-spacing="0.5">
      ${escapeXml(breadcrumbTag)}
    </text>

    <!-- Breadcrumb Slash & Subtitle -->
    <text x="336" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#94A3B8">
      / <tspan fill="#64748B" font-weight="600">${escapeXml(breadcrumbSub)}</tspan>
    </text>

    <!-- Right Live Status Pill -->
    <rect x="880" y="2" width="200" height="34" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    <circle cx="902" cy="19" r="4.5" fill="#16A34A"/>
    <text x="1000" y="23" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" font-weight="700" fill="#0F172A" letter-spacing="0.6">
      VERIFIED SHARED ASSET
    </text>
  </g>

  <!-- MAIN WHITE CONTENT CONTAINER (Matches In-App White Cards) -->
  <g transform="translate(60, 108)">
    <rect x="0" y="0" width="1080" height="452" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="url(#cardShadow)"/>

    <!-- Top Card Subheader: Red Status Dot, Public Pill & Monospace Label -->
    <g transform="translate(44, 40)">
      <!-- Red Accent Status Dot -->
      <circle cx="6" cy="12" r="6" fill="${accentColor}"/>

      <!-- Public Pill Badge (Matches In-App "Public" Badge) -->
      <rect x="24" y="0" width="68" height="24" rx="12" fill="#FFF1F2" stroke="#FDA4AF" stroke-width="1"/>
      <text x="58" y="16" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" font-weight="800" fill="#E11D48">
        Public
      </text>

      <!-- Context Sublabel -->
      <text x="104" y="16" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="12" font-weight="700" fill="#64748B" letter-spacing="1">
        POKÉMON TCG // DECK DIVIDER DIRECTORY
      </text>
    </g>

    <!-- Prominent Title (High Contrast Dark Slate #0F172A) -->
    <g transform="translate(44, 0)">
      <!-- Title Line 1 -->
      <text x="0" y="${titleY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="800" fill="#0F172A" letter-spacing="-0.8">
        ${escapeXml(lines[0])}
      </text>

      ${
        isMultiLine
          ? `<!-- Title Line 2 -->
      <text x="0" y="${titleY + titleLineHeight}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="800" fill="#0F172A" letter-spacing="-0.8">
        ${escapeXml(lines[1])}
      </text>`
          : ''
      }

      <!-- Descriptive Subtitle (Slate 500 #64748B) -->
      <text x="0" y="${isMultiLine ? titleY + titleLineHeight + 42 : titleY + 44}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="500" fill="#64748B">
        ${escapeXml(subtitle)}
      </text>
    </g>

    <!-- Divider Line -->
    <line x1="44" y1="316" x2="1036" y2="316" stroke="#F1F5F9" stroke-width="1.5"/>

    <!-- 3-Column Metrics Row (Clean Light Panels matching App Cards) -->
    <g transform="translate(44, 336)">
      <!-- Panel 1 -->
      <rect x="0" y="0" width="316" height="84" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="20" y="30" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" font-weight="700" fill="#64748B" letter-spacing="0.8">
        ${escapeXml(m1Label)}
      </text>
      <text x="20" y="62" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" font-weight="800" fill="#0F172A">
        ${escapeXml(m1Value)}
      </text>

      <!-- Panel 2 -->
      <rect x="338" y="0" width="316" height="84" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="358" y="30" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" font-weight="700" fill="#64748B" letter-spacing="0.8">
        ${escapeXml(m2Label)}
      </text>
      <text x="358" y="62" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" font-weight="800" fill="#16A34A">
        ${escapeXml(m2Value)}
      </text>

      <!-- Panel 3 -->
      <rect x="676" y="0" width="316" height="84" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
      <text x="696" y="30" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" font-weight="700" fill="#64748B" letter-spacing="0.8">
        ${escapeXml(m3Label)}
      </text>
      <text x="696" y="62" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" font-weight="800" fill="#0F172A">
        ${escapeXml(m3Value)}
      </text>
    </g>
  </g>

  <!-- BOTTOM FOOTER (Domain Stamp & Status) -->
  <g transform="translate(60, 588)">
    <circle cx="8" cy="-4" r="4" fill="#16A34A"/>
    <text x="24" y="0" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="12" font-weight="600" fill="#64748B">
      deckdivider.app <tspan fill="#CBD5E1">•</tspan> Precision Pokémon TCG Operating System
    </text>

    <text x="1080" y="0" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="12" font-weight="700" fill="#DC143C">
      LIVE TCGPLAYER SYNC
    </text>
  </g>
</svg>`;
}

/**
 * Converts SVG string to a high-quality 1200x630 PNG buffer using Sharp
 */
export async function generateOgImagePng(options: OgImageOptions): Promise<Buffer> {
  const svgString = generateOgImageSvg(options);
  const pngBuffer = await sharp(Buffer.from(svgString), { density: 150 })
    .resize(1200, 630)
    .png({ quality: 95, compressionLevel: 8 })
    .toBuffer();
  return pngBuffer;
}
