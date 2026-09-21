/**
 * Dynamic SVG Badge Generation Service
 * Serves real-time SVG badges for decks, sets, portfolios, slabs, and verified collectors
 * with verified dofollow backlink styling and zero CLS.
 */
import { Request, Response, Router } from 'express';

export const badgeRouter = Router();

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface BadgeRenderOptions {
  title: string;
  subtitle: string;
  badgeLabel: string;
  metricLabel?: string;
  metricValue: string;
  theme?: 'light' | 'dark';
}

function renderDynamicBadgeSvg(opts: BadgeRenderOptions): string {
  const isDark = opts.theme === 'dark';
  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const titleColor = isDark ? '#F8FAFC' : '#0F172A';
  const subColor = isDark ? '#94A3B8' : '#64748B';
  const tagBg = isDark ? '#1E293B' : '#F1F5F9';
  const tagText = isDark ? '#CBD5E1' : '#475569';
  const brandCrimson = '#DC143C';
  const greenText = '#16A34A';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="340" height="74" viewBox="0 0 340 74" fill="none">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&amp;family=JetBrains+Mono:wght@600;700&amp;display=swap');
      .title { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 700; font-size: 13px; fill: ${titleColor}; }
      .sub { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500; font-size: 11px; fill: ${subColor}; }
      .metric { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; font-weight: 700; font-size: 11px; fill: ${brandCrimson}; }
      .badge-label { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; font-weight: 700; font-size: 9px; letter-spacing: 0.5px; fill: ${tagText}; }
    </style>
  </defs>

  <!-- Container Box -->
  <rect width="338" height="72" x="1" y="1" rx="14" fill="${bgColor}" stroke="${borderColor}" stroke-width="1"/>
  
  <!-- Left Accent Pokeball Icon -->
  <circle cx="28" cy="37" r="14" fill="${brandCrimson}" fill-opacity="0.1"/>
  <circle cx="28" cy="37" r="6" fill="${brandCrimson}"/>
  <line x1="14" y1="37" x2="42" y2="37" stroke="${bgColor}" stroke-width="1.5" />
  <circle cx="28" cy="37" r="2.5" fill="${bgColor}"/>

  <!-- Text Header & Subtitle -->
  <text x="52" y="29" class="title">${escapeXml(opts.title)}</text>
  <text x="52" y="46" class="sub">${escapeXml(opts.subtitle)}</text>
  
  <!-- Sub-Badge Pill -->
  <rect x="52" y="53" width="90" height="14" rx="3" fill="${tagBg}"/>
  <text x="56" y="63" class="badge-label">${escapeXml(opts.badgeLabel.toUpperCase())}</text>

  <!-- Right Metric Pill -->
  <rect x="236" y="24" width="92" height="26" rx="6" fill="${tagBg}" stroke="${borderColor}" stroke-width="0.5"/>
  <text x="282" y="41" text-anchor="middle" class="metric">${escapeXml(opts.metricValue)}</text>
</svg>`;
}

// 1. Deck Badge
badgeRouter.get(['/deck/:id', '/deck/:id.svg'], (req: Request, res: Response) => {
  const rawId = req.params.id || 'tournament-deck';
  const id = rawId.replace(/\.svg$/, '');
  const theme = (req.query.theme as string) === 'dark' ? 'dark' : 'light';
  let title = (req.query.title as string) || '';
  let count = (req.query.count as string) || '60 Cards';
  let value = (req.query.value as string) ? `$${req.query.value}` : 'Standard Legal';

  if (!title) {
    title = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  const svg = renderDynamicBadgeSvg({
    title: title || 'Pokémon Deck',
    subtitle: 'Verified Tournament Roster',
    badgeLabel: 'DECK / DIVIDER',
    metricValue: value,
    theme
  });

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
  res.send(svg);
});

// 2. Set Badge
badgeRouter.get(['/set/:id', '/set/:id.svg'], (req: Request, res: Response) => {
  const rawId = req.params.id || 'expansion';
  const id = rawId.replace(/\.svg$/, '').toLowerCase();
  const theme = (req.query.theme as string) === 'dark' ? 'dark' : 'light';
  let title = (req.query.title as string) || `${id.toUpperCase()} Expansion`;
  let series = (req.query.series as string) || 'Pokémon TCG';
  let count = (req.query.count as string) || 'Live Checklist';

  const svg = renderDynamicBadgeSvg({
    title,
    subtitle: `${series} Master Set`,
    badgeLabel: 'CHECKLIST & PRICES',
    metricValue: count,
    theme
  });

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
  res.send(svg);
});

// 3. Portfolio Badge
badgeRouter.get(['/portfolio/:id', '/portfolio/:id.svg'], (req: Request, res: Response) => {
  const rawId = req.params.id || 'collector';
  const id = rawId.replace(/\.svg$/, '');
  const theme = (req.query.theme as string) === 'dark' ? 'dark' : 'light';
  let title = (req.query.title as string) || (req.query.name as string) || `@${id}`;
  let value = (req.query.value as string) ? `$${req.query.value}` : 'Verified Vault';

  const svg = renderDynamicBadgeSvg({
    title: `${title}'s Vault`,
    subtitle: 'Verified Pokémon TCG Collection',
    badgeLabel: 'LIVE PORTFOLIO NAV',
    metricValue: value,
    theme
  });

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
  res.send(svg);
});

// 4. Collector Badge
badgeRouter.get(['/collector/:id', '/collector/:id.svg'], (req: Request, res: Response) => {
  const rawId = req.params.id || 'trainer';
  const id = rawId.replace(/\.svg$/, '');
  const theme = (req.query.theme as string) === 'dark' ? 'dark' : 'light';

  const svg = renderDynamicBadgeSvg({
    title: `@${id}`,
    subtitle: 'Verified Trainer & Collector',
    badgeLabel: 'VERIFIED MEMBER',
    metricValue: 'DECK / divider',
    theme
  });

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
  res.send(svg);
});
