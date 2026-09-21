/**
 * Embed Badge & Backlink Generator Engine for DECK / divider
 * 
 * Programmatically generates embeddable SVGs, HTML snippets, Markdown, BBCode,
 * and live iFrame widgets for 60-card decks, graded slab portfolios, master sets, and collector profiles.
 * Every embed creates a clean, fast-loading, zero-CLS backlink to deckdivider.app.
 */

export interface EmbedBadgeOptions {
  type: 'deck' | 'portfolio' | 'set' | 'slab';
  title: string;
  subtitle?: string;
  count?: number;
  value?: number;
  currency?: string;
  idOrSlug: string;
  theme?: 'dark' | 'light';
}

function getTargetUrl(options: EmbedBadgeOptions, medium: string = 'embed_badge'): string {
  const { type, idOrSlug } = options;
  const baseUrl = 'https://deckdivider.app';
  
  let targetPath = '';
  switch (type) {
    case 'deck':
      targetPath = `/deck/${idOrSlug}`;
      break;
    case 'portfolio':
      targetPath = `/portfolio/${idOrSlug}`;
      break;
    case 'set':
      targetPath = `/set/${idOrSlug}`;
      break;
    case 'slab':
      targetPath = `/slabs?cert=${idOrSlug}`;
      break;
    default:
      targetPath = '/';
  }

  return `${baseUrl}${targetPath}?utm_source=embed_badge&utm_medium=${medium}&utm_campaign=community_embed`;
}

/**
 * Generates copy-paste HTML markup for bloggers and webmasters
 */
export function generateHtmlEmbedSnippet(options: EmbedBadgeOptions): string {
  const { type, title, idOrSlug } = options;
  const baseUrl = 'https://deckdivider.app';
  const fullTargetUrl = getTargetUrl(options, 'html_embed');
  const altText = `${title} on DECK / divider — Pokémon TCG Collection Tracker`;
  
  return `<a href="${fullTargetUrl}" target="_blank" rel="noopener" title="${title} on DECK / divider">
  <img src="${baseUrl}/api/badge/${type}/${idOrSlug}.svg" alt="${altText}" width="340" height="74" loading="lazy" decoding="async" style="border-radius:12px;border:1px solid #E2E8F0;" />
</a>`;
}

/**
 * Generates Markdown embed snippet for GitHub READMEs, Reddit, and Discord
 */
export function generateMarkdownEmbedSnippet(options: EmbedBadgeOptions): string {
  const { type, title, idOrSlug } = options;
  const baseUrl = 'https://deckdivider.app';
  const fullTargetUrl = getTargetUrl(options, 'markdown_embed');
  const altText = `${title} on DECK / divider`;
  
  return `[![${altText}](${baseUrl}/api/badge/${type}/${idOrSlug}.svg)](${fullTargetUrl})`;
}

/**
 * Generates BBCode embed snippet for PokéBeach, PokéGym, and traditional TCG forums
 */
export function generateBBCodeEmbedSnippet(options: EmbedBadgeOptions): string {
  const { type, idOrSlug } = options;
  const baseUrl = 'https://deckdivider.app';
  const fullTargetUrl = getTargetUrl(options, 'forum_bbcode');
  
  return `[url=${fullTargetUrl}][img]${baseUrl}/api/badge/${type}/${idOrSlug}.svg[/img][/url]`;
}

/**
 * Generates iFrame mini card widget snippet for webmasters and tournament organizers
 */
export function generateIframeEmbedSnippet(options: EmbedBadgeOptions): string {
  const { type, idOrSlug, title } = options;
  const baseUrl = 'https://deckdivider.app';
  const embedPath = type === 'deck' ? `/deck/${idOrSlug}` : type === 'portfolio' ? `/portfolio/${idOrSlug}` : `/set/${idOrSlug}`;
  
  return `<iframe src="${baseUrl}${embedPath}?embed=true" width="100%" height="380" frameborder="0" style="border-radius:16px;border:1px solid #E2E8F0;box-shadow:0 4px 12px rgba(0,0,0,0.05);" title="${title} Live Showcase on DECK / divider" loading="lazy"></iframe>`;
}

/**
 * Generates standalone clean SVG string for dynamic badge rendering
 */
export function generateBadgeSvg(options: EmbedBadgeOptions): string {
  const { title, subtitle = 'Verified on DECK / divider', count, value, currency = '$', theme = 'light' } = options;
  const isDark = theme === 'dark';
  
  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const titleColor = isDark ? '#F8FAFC' : '#0F172A';
  const subColor = isDark ? '#94A3B8' : '#64748B';
  const tagBg = isDark ? '#1E293B' : '#F1F5F9';
  const tagText = isDark ? '#CBD5E1' : '#475569';
  const brandColor = '#DC143C';
  
  const metricText = value !== undefined 
    ? `${currency}${Number(value).toLocaleString()}`
    : (count !== undefined ? `${count} Cards` : 'Verified');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="74" viewBox="0 0 340 74" fill="none">
  <rect width="338" height="72" x="1" y="1" rx="14" fill="${bgColor}" stroke="${borderColor}" stroke-width="1"/>
  <circle cx="28" cy="37" r="14" fill="${brandColor}" fill-opacity="0.1"/>
  <circle cx="28" cy="37" r="6" fill="${brandColor}"/>
  <line x1="14" y1="37" x2="42" y2="37" stroke="${bgColor}" stroke-width="1.5" />
  <circle cx="28" cy="37" r="2.5" fill="${bgColor}"/>
  <text x="52" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="${titleColor}">${escapeXml(title)}</text>
  <text x="52" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" fill="${subColor}">${escapeXml(subtitle)}</text>
  <rect x="52" y="53" width="90" height="14" rx="3" fill="${tagBg}"/>
  <text x="56" y="63" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" font-weight="700" letter-spacing="0.5px" fill="${tagText}">DECK / DIVIDER</text>
  <rect x="236" y="24" width="92" height="26" rx="6" fill="${tagBg}" stroke="${borderColor}" stroke-width="0.5"/>
  <text x="282" y="41" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" font-weight="700" fill="${brandColor}">${escapeXml(metricText)}</text>
</svg>`;
}

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
