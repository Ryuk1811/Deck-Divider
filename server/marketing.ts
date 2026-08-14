import { Router } from 'express';

export const marketingRoutes = Router();

const COMMON_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@500;600;700&display=swap');

  :root {
    --bg-primary: #FFFFFF;
    --bg-secondary: #F8FAFC;
    --border-color: #E2E8F0;
    --text-primary: #0F172A;
    --text-secondary: #64748B;
    --accent: #DC143C;
    --accent-hover: #B01030;
    --accent-subtle: #FFF0F3;
    --success: #16A34A;
    --warning: #D97706;
    --font-heading: 'Space Grotesk', sans-serif;
    --font-ui: 'IBM Plex Mono', monospace;
    --font-num: 'JetBrains Mono', monospace;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: var(--bg-secondary);
    background-image: radial-gradient(#CBD5E1 1.25px, transparent 1.25px);
    background-size: 20px 20px;
    color: var(--text-primary);
    font-family: var(--font-ui);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, .font-heading {
    font-family: var(--font-heading);
    letter-spacing: -0.02em;
  }

  .font-num {
    font-family: var(--font-num);
  }

  @keyframes pulseRing {
    0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
    100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    background-color: var(--success);
    border-radius: 50%;
    display: inline-block;
    animation: pulseRing 2s infinite ease-in-out;
  }

  @keyframes holoGlint {
    0% { transform: translateX(-100%) rotate(25deg); }
    100% { transform: translateX(200%) rotate(25deg); }
  }

  .holo-card-container {
    position: relative;
    overflow: hidden;
    transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 240ms ease;
  }

  .holo-card-container:hover {
    transform: translateY(-4px) scale(1.015);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
    border-color: #CBD5E1 !important;
  }

  .text-backdrop-card {
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border-color);
    border-left: 3px solid var(--accent);
    padding: 20px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
    margin-bottom: 20px;
  }

  .matte-panel {
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 28px;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
    transition: border-color 220ms ease;
  }

  .glass-panel {
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.04);
  }

  .glass-slab-divider {
    max-width: 1200px;
    margin: 28px auto;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--border-color) 20%, var(--border-color) 80%, transparent 100%);
    position: relative;
  }

  .glass-slab-divider::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 9px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    backdrop-filter: blur(8px);
  }

  .card-aspect-frame {
    aspect-ratio: 63 / 88;
    width: 100%;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background: #F1F5F9;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
  }

  .card-aspect-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .card-aspect-image:hover {
    transform: scale(1.04);
  }

  .btn-crimson {
    background-color: var(--accent);
    color: #FFFFFF;
    padding: 10px 22px;
    border-radius: 6px;
    text-decoration: none;
    font-family: var(--font-ui);
    font-size: 13px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1);
    border: none;
    cursor: pointer;
    white-space: nowrap;
  }

  .btn-crimson:hover {
    background-color: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(220, 20, 60, 0.28);
  }

  .btn-outline {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    padding: 10px 22px;
    border-radius: 6px;
    text-decoration: none;
    font-family: var(--font-ui);
    font-size: 13px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid var(--border-color);
    transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    white-space: nowrap;
  }

  .btn-outline:hover {
    background-color: var(--bg-secondary);
    border-color: #CBD5E1;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
  }

  .navbar {
    background-color: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: var(--text-primary);
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 17px;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 20px;
    list-style: none;
  }

  .nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    transition: color 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .nav-links a:hover {
    color: var(--text-primary);
  }

  .feature-z-row {
    display: grid;
    grid-template-columns: 1fr 1.15fr;
    gap: 48px;
    align-items: center;
    margin-bottom: 40px;
  }

  .feature-z-row.reverse {
    grid-template-columns: 1.15fr 1fr;
  }

  @media (max-width: 960px) {
    .feature-z-row, .feature-z-row.reverse {
      grid-template-columns: 1fr;
      gap: 28px;
    }
  }

  .matrix-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: left;
  }

  .matrix-table th {
    background: var(--bg-secondary);
    padding: 14px 16px;
    border-bottom: 2px solid var(--border-color);
    font-family: var(--font-heading);
    font-weight: 700;
    color: var(--text-primary);
  }

  .matrix-table td {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-secondary);
  }

  .matrix-table tr:hover td {
    background: rgba(248, 250, 252, 0.8);
  }

  .matrix-check {
    color: var(--success);
    font-weight: 700;
  }

  .matrix-cross {
    color: #94A3B8;
  }

  .scrollable-articles-frame {
    max-height: 460px;
    overflow-y: auto;
    padding-right: 10px;
  }

  .scrollable-articles-frame::-webkit-scrollbar {
    width: 5px;
  }

  .scrollable-articles-frame::-webkit-scrollbar-track {
    background: var(--bg-secondary);
    border-radius: 3px;
  }

  .scrollable-articles-frame::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 3px;
  }

  .scrollable-articles-frame::-webkit-scrollbar-thumb:hover {
    background: var(--accent);
  }

  .faq-item {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin-bottom: 10px;
    overflow: hidden;
    transition: border-color 220ms ease;
  }

  .faq-item:hover {
    border-color: #CBD5E1;
  }

  .faq-summary {
    padding: 16px 20px;
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    user-select: none;
  }

  .faq-summary::-webkit-details-marker {
    display: none;
  }

  .faq-content {
    padding: 0 20px 16px;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.6;
    border-top: 1px solid #F1F5F9;
    margin-top: 6px;
    padding-top: 14px;
  }

  .footer {
    border-top: 1px solid var(--border-color);
    background-color: var(--bg-primary);
    padding: 48px 24px 28px;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr repeat(3, 1fr);
    gap: 36px;
  }

  .footer-brand {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 17px;
    margin-bottom: 10px;
  }

  .footer-desc {
    color: var(--text-secondary);
    font-size: 12px;
    max-width: 320px;
    line-height: 1.6;
  }

  .footer-col-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-primary);
    margin-bottom: 14px;
  }

  .footer-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .footer-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 12px;
    transition: color 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .footer-links a:hover {
    color: var(--text-primary);
  }

  .footer-bottom {
    max-width: 1200px;
    margin: 36px auto 0;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-secondary);
    font-size: 12px;
  }

  @media (max-width: 900px) {
    .footer-container { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 600px) {
    .footer-container { grid-template-columns: 1fr; }
  }
`;

function renderHeader(title: string, description: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title} — DECK / divider</title>
      <meta name="description" content="${description}" />
      <style>${COMMON_CSS}</style>
    </head>
    <body>
      <nav class="navbar">
        <div class="nav-container">
          <a href="/" class="nav-logo">
            <span style="color: var(--accent);">DECK</span>
            <span style="color: var(--border-color); font-weight: 300;">/</span>
            <span>divider</span>
          </a>
          <ul class="nav-links">
            <li><a href="/#features">Portfolio Tracking</a></li>
            <li><a href="/#decks">User Deck Builder</a></li>
            <li><a href="/#vault">Graded Slabs & Binders</a></li>
            <li><a href="/#comparison">Comparison</a></li>
            <li><a href="/#pricing">Pricing</a></li>
            <li><a href="/#articles">Journal</a></li>
            <li><a href="/#faq">FAQ</a></li>
            <li><a href="/app" class="btn-crimson" style="padding: 6px 14px; font-size: 12px;">Open App Studio</a></li>
          </ul>
        </div>
      </nav>
  `;
}

function renderFooter() {
  return `
      <footer class="footer">
        <div class="footer-container">
          <div>
            <div class="footer-brand">DECK <span style="color: var(--accent);">/</span> divider</div>
            <p class="footer-desc">
              The complete portfolio manager, digital binder workspace, custom list builder, and flexible deck system for Pokémon TCG collectors and players.
            </p>
          </div>
          <div>
            <div class="footer-col-title">Platform Features</div>
            <ul class="footer-links">
              <li><a href="/app">Launch App Studio</a></li>
              <li><a href="/#features">Portfolio Valuation & Profit Audits</a></li>
              <li><a href="/#decks">Custom Deck Builder & PTCGL Export</a></li>
              <li><a href="/#vault">PSA, BGS & CGC Graded Slabs</a></li>
              <li><a href="/#comparison">Platform Feature Comparison</a></li>
              <li><a href="/#pricing">Subscription Plans & Limits</a></li>
            </ul>
          </div>
          <div>
            <div class="footer-col-title">Collector Resources</div>
            <ul class="footer-links">
              <li><a href="/#articles">Pokémon TCG Strategy Journal</a></li>
              <li><a href="/#articles">PSA vs BGS Grading Differences</a></li>
              <li><a href="/#articles">151 Set Completion Tracker Guide</a></li>
              <li><a href="/#faq">Frequently Asked Questions</a></li>
              <li><a href="/sitemap.xml">XML Sitemap</a></li>
            </ul>
          </div>
          <div>
            <div class="footer-col-title">Legal & Security</div>
            <ul class="footer-links">
              <li><a href="/#privacy">Privacy Guarantee</a></li>
              <li><a href="/#terms">Terms of Service</a></li>
              <li><a href="/#security">Safe Data Preservation Policy</a></li>
              <li><a href="/robots.txt">robots.txt</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div>© ${new Date().getFullYear()} DECK / divider. All rights reserved. Registered trademark of DECK Platform Systems.</div>
          <div style="font-family: var(--font-num);">TCGPlayer & CardMarket Live Market Pricing</div>
        </div>
      </footer>
    </body>
    </html>
  `;
}

const BLOG_ARTICLES = [
  {
    slug: 'grading-companies-compared',
    title: 'PSA vs BGS vs CGC: Pop Reports, Subgrades, and Resale Values',
    date: 'August 12, 2026',
    category: 'GRADED SLABS',
    readTime: '6 min read',
    excerpt: 'A clear breakdown of grading differences between PSA, BGS, and CGC, explaining subgrades, encapsulation quality, and market resale value.',
    content: `
      <p style="font-size: 14px; line-height: 1.7; color: var(--text-primary); margin-bottom: 16px;">
        When grading Pokémon cards, choosing between PSA, BGS, and CGC depends on your collection goals. Each grading service offers unique slab designs, turnarounds, and market recognition.
      </p>
      <h3 style="font-size: 15px; font-weight: 700; margin: 16px 0 8px; font-family: var(--font-heading);">1. PSA: High Demand & Recognized Standard</h3>
      <p style="font-size: 14px; line-height: 1.7; color: var(--text-secondary); margin-bottom: 16px;">
        PSA remains the most widely traded slab on ebay and TCG events. PSA 10 Gem Mint cards generally enjoy high liquidity and established price trends.
      </p>
      <h3 style="font-size: 15px; font-weight: 700; margin: 16px 0 8px; font-family: var(--font-heading);">2. BGS: Subgrades & Pristine Black Labels</h3>
      <p style="font-size: 14px; line-height: 1.7; color: var(--text-secondary); margin-bottom: 16px;">
        Beckett evaluates Centering, Corners, Edges, and Surface individually. Perfect BGS 10 Black Labels carry significant premiums among high-end collectors.
      </p>
      <h3 style="font-size: 15px; font-weight: 700; margin: 16px 0 8px; font-family: var(--font-heading);">3. CGC: Crystal Clear Holders & Modern Sets</h3>
      <p style="font-size: 14px; line-height: 1.7; color: var(--text-secondary);">
        CGC's Gold Pristine 10 label and ultra-clear plastic cases are popular for modern Japanese secret rare cards and illustration rares.
      </p>
    `
  },
  {
    slug: 'sv3pt5-151-market-analysis',
    title: 'Scarlet & Violet 151: Master Set Progress & Card Values',
    date: 'August 08, 2026',
    category: 'SET ANALYTICS',
    readTime: '7 min read',
    excerpt: 'Tracking master set completion for S&V 151, including Poké Ball and Master Ball reverse holos, Charizard SIR, and Illustration Rares.',
    content: `
      <p style="font-size: 14px; line-height: 1.7; color: var(--text-primary); margin-bottom: 16px;">
        Scarlet & Violet 151 is a favorite among collectors seeking the original 151 Kanto Pokémon. Completing a full master set requires organizing 165 base cards, 42 secret rares, and reverse holo variants.
      </p>
      <p style="font-size: 14px; line-height: 1.7; color: var(--text-secondary);">
        In DECK / divider, you can track each card, note duplicate trade copies, and log acquisition prices to monitor total set value.
      </p>
    `
  },
  {
    slug: 'deck-building-for-players-and-collectors',
    title: 'Building Custom Decks for Play, Theorycrafting & Collection Showcase',
    date: 'August 01, 2026',
    category: 'DECK BUILDER',
    readTime: '5 min read',
    excerpt: 'How to build custom Pokémon TCG decks in DECK / divider, from 25-card casual fun decks to full 60-card tournament-ready lists.',
    content: `
      <p style="font-size: 14px; line-height: 1.7; color: var(--text-primary); margin-bottom: 16px;">
        The deck builder in DECK / divider isn't just for hard-core tournament players. Whether you're organizing a theme deck, testing casual card combinations, or building a competitive 60-card deck, you can easily add cards and manage quantities.
      </p>
      <p style="font-size: 14px; line-height: 1.7; color: var(--text-secondary);">
        You can export your finished deck lists directly into Pokémon TCG Live (PTCGL) format or share a public link with friends (Stack tier and up).
      </p>
    `
  },
  {
    slug: 'sealed-booster-box-tracking',
    title: 'Tracking Sealed Booster Boxes & Elite Trainer Boxes',
    date: 'July 24, 2026',
    category: 'SEALED VAULT',
    readTime: '6 min read',
    excerpt: 'Simple strategies for logging factory-sealed booster boxes, ETBs, and special collection boxes alongside single card inventories.',
    content: `
      <p style="font-size: 14px; line-height: 1.7; color: var(--text-primary); margin-bottom: 16px;">
        Sealed Pokémon products are a major part of modern collections. Logging purchase prices and keeping track of unopened booster boxes or ETBs gives you a complete view of your total collection value.
      </p>
    `
  }
];

const monolithBody = `
  <div id="home">
    <!-- HERO SECTION -->
    <section style="padding: 64px 24px 48px; text-align: center; position: relative;">
      <div style="max-width: 960px; margin: 0 auto;">
        
        <!-- Live Status Ticker -->
        <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; padding: 6px 16px; background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 20px; color: var(--text-secondary); margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span class="pulse-dot"></span> Live Price Feeds Active • 1,250,000+ Pokémon Cards Indexed • PTCGL Export Ready
        </div>

        <!-- Headline -->
        <h1 style="font-size: 46px; font-weight: 700; color: var(--text-primary); line-height: 1.15; margin-bottom: 20px; font-family: var(--font-heading); letter-spacing: -0.02em;">
          The Complete Pokémon TCG Portfolio, Binder Workspace & Deck Builder.
        </h1>

        <!-- Subheading in Text Backdrop Card -->
        <div class="text-backdrop-card" style="max-width: 760px; margin: 0 auto 32px; text-align: left;">
          <p style="font-size: 15px; color: var(--text-primary); line-height: 1.65; font-weight: 500;">
            DECK / divider gives Pokémon TCG collectors and players everything in one clean platform: live market valuations (TCGPlayer & CardMarket), custom deck building with shareable public links, digital 9-pocket binders, custom wishlists, and graded slab logging.
          </p>
        </div>

        <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 48px;">
          <a href="/app" class="btn-crimson" style="padding: 12px 28px; font-size: 14px;">Open Portfolio App Studio</a>
          <a href="/#features" class="btn-outline" style="padding: 12px 28px; font-size: 14px;">Explore All Features</a>
        </div>

        <!-- Live Portfolio Preview Dashboard -->
        <div class="glass-panel" style="max-width: 1000px; margin: 0 auto; padding: 24px; text-align: left;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 20px;">
            <div style="display: flex; gap: 10px; align-items: center;">
              <span style="font-size: 10px; font-weight: 700; color: var(--accent); letter-spacing: 0.05em; text-transform: uppercase; border: 1px solid var(--accent); padding: 2px 8px; border-radius: 4px; background: var(--accent-subtle);">LIVE APP PREVIEW</span>
              <span style="font-size: 14px; font-weight: 600; font-family: var(--font-heading);">Collector Portfolio Summary</span>
            </div>
            <a href="/app" style="font-size: 11px; font-family: var(--font-ui); background: var(--text-primary); color: var(--bg-primary); padding: 5px 12px; border-radius: 4px; font-weight: 600; text-decoration: none;">Launch App →</a>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px;">
              <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Collection Market Value</div>
              <div style="font-family: var(--font-num); font-size: 24px; font-weight: 700; color: var(--text-primary);">$14,850.00</div>
              <div style="font-size: 10px; color: var(--text-secondary); margin-top: 4px;">1,452 indexed cards & slabs</div>
            </div>
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px;">
              <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Total Purchase Cost</div>
              <div style="font-family: var(--font-num); font-size: 24px; font-weight: 700; color: var(--text-primary);">$9,200.00</div>
              <div style="font-size: 10px; color: var(--text-secondary); margin-top: 4px;">Cost basis tracked</div>
            </div>
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px;">
              <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Unrealized Profit</div>
              <div style="font-family: var(--font-num); font-size: 24px; font-weight: 700; color: var(--success);">+$5,650.00</div>
              <div style="font-size: 10px; color: var(--text-secondary); margin-top: 4px;">+61.4% gain</div>
            </div>
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px;">
              <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Active Decks & Lists</div>
              <div style="font-family: var(--font-num); font-size: 24px; font-weight: 700; color: var(--text-primary);">12 Custom</div>
              <div style="font-size: 10px; color: var(--text-secondary); margin-top: 4px;">Ready to play & share</div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- MARKET COVERAGE BAND -->
    <div style="background: var(--bg-primary); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 16px 24px;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-around; align-items: center; gap: 16px; font-size: 12px; font-family: var(--font-num); color: var(--text-secondary);">
        <div><strong style="color: var(--text-primary);">1,250,000+</strong> Cards Database</div>
        <div><strong style="color: var(--text-primary);">TCGPlayer USD & CardMarket EUR</strong> Live Data</div>
        <div><strong style="color: var(--text-primary);">PSA, BGS & CGC</strong> Graded Slabs</div>
        <div><strong style="color: var(--text-primary);">Base Set to Latest Scarlet & Violet</strong> Sets</div>
      </div>
    </div>

    <div class="glass-slab-divider"></div>

    <!-- CORE FEATURES SHOWCASE -->
    <section id="features" style="padding: 44px 24px; max-width: 1200px; margin: 0 auto;">
      
      <!-- Feature 01: Portfolio & Cost Basis Tracking -->
      <div class="feature-z-row">
        <div>
          <span style="font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 10px;">01 • PORTFOLIO & VALUATION</span>
          <h2 style="font-size: 30px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; font-family: var(--font-heading);">
            Clear market valuations and purchase cost tracking.
          </h2>
          
          <div class="text-backdrop-card">
            <p style="color: var(--text-primary); font-size: 14px; line-height: 1.6;">
              Know what your collection is worth at all times. Log exact purchase prices, view market value changes over time, track unrealized P&L, and keep a sales history for cards you sell or trade.
            </p>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap; font-size: 11px; font-family: var(--font-num);">
            <span style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 4px; color: var(--text-secondary);">TCGPlayer Market Prices</span>
            <span style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 4px; color: var(--text-secondary);">CardMarket EUR Rates</span>
            <span style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 4px; color: var(--text-secondary);">Sales History Log</span>
          </div>
        </div>

        <div class="matte-panel">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-primary); letter-spacing: 0.05em; margin-bottom: 14px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; display: flex; justify-content: space-between;">
            <span>RECENT INVENTORY LOGS</span>
            <span style="font-family: var(--font-num); color: var(--text-secondary);">TRACKED ITEMS</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px;">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Charizard ex #199 (SV 151)</div>
                <div style="font-size: 10px; color: var(--text-secondary); font-family: var(--font-num);">Bought at $98.30 • TCGPlayer Market</div>
              </div>
              <div style="text-align: right; font-family: var(--font-num);">
                <div style="font-weight: 700;">$112.50</div>
                <div style="font-size: 10px; color: var(--success);">+$14.20 (+14.4%)</div>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px;">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Giratina VSTAR PSA 10 Gem Mint</div>
                <div style="font-size: 10px; color: var(--text-secondary); font-family: var(--font-num);">Bought at $385.00 • Slab Cert #84729104</div>
              </div>
              <div style="text-align: right; font-family: var(--font-num);">
                <div style="font-weight: 700;">$450.00</div>
                <div style="font-size: 10px; color: var(--success);">+$65.00 (+16.8%)</div>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px;">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">151 Booster Box (Sealed)</div>
                <div style="font-size: 10px; color: var(--text-secondary); font-family: var(--font-num);">Bought at $140.00 • Sealed Vault</div>
              </div>
              <div style="text-align: right; font-family: var(--font-num);">
                <div style="font-weight: 700;">$185.00</div>
                <div style="font-size: 10px; color: var(--success);">+$45.00 (+32.1%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-slab-divider"></div>

      <!-- Feature 02: User-Centric Deck Feature -->
      <div id="decks" class="feature-z-row reverse">
        <div class="matte-panel" style="padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 14px;">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase;">Charizard & Pidgeot Casual Play Deck</span>
            <span style="font-size: 10px; font-family: var(--font-num); color: var(--accent); font-weight: 600;">PUBLIC LINK ACTIVE</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px;">
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; padding: 4px; text-align: center;">
              <div class="card-aspect-frame" style="margin-bottom: 4px;">
                <img src="https://assets.tcgdex.net/en/sv/sv03.5/199/high.png" alt="Charizard" class="card-aspect-image" />
              </div>
              <div style="font-size: 9px; font-weight: 700;">3x Charizard ex</div>
              <div style="font-size: 8px; color: var(--success); font-weight: 600;">ACTIVE</div>
            </div>

            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; padding: 4px; text-align: center;">
              <div class="card-aspect-frame" style="margin-bottom: 4px;">
                <img src="https://assets.tcgdex.net/en/sv/sv03.5/173/high.png" alt="Pikachu" class="card-aspect-image" />
              </div>
              <div style="font-size: 9px; font-weight: 700;">2x Pikachu</div>
              <div style="font-size: 8px; color: var(--success); font-weight: 600;">ACTIVE</div>
            </div>

            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; padding: 4px; text-align: center;">
              <div class="card-aspect-frame" style="margin-bottom: 4px;">
                <img src="https://assets.tcgdex.net/en/sv/sv03.5/205/high.png" alt="Mew ex" class="card-aspect-image" />
              </div>
              <div style="font-size: 9px; font-weight: 700;">1x Mew ex</div>
              <div style="font-size: 8px; color: var(--success); font-weight: 600;">ACTIVE</div>
            </div>

            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; padding: 4px; text-align: center;">
              <div class="card-aspect-frame" style="margin-bottom: 4px;">
                <img src="https://assets.tcgdex.net/en/swsh/swsh11/131/high.png" alt="Giratina" class="card-aspect-image" />
              </div>
              <div style="font-size: 9px; font-weight: 700;">2x Giratina V</div>
              <div style="font-size: 8px; color: var(--success); font-weight: 600;">ACTIVE</div>
            </div>
          </div>

          <div style="background: #F1F5F9; border: 1px solid var(--border-color); border-radius: 6px; padding: 10px; font-size: 11px; color: var(--text-primary); display: flex; align-items: center; justify-content: space-between;">
            <span><strong>Deck Utility:</strong> 60 Cards Total • Energy Breakdown • One-Click PTCGL Export</span>
            <a href="/app" style="color: var(--accent); font-weight: 700; text-decoration: none;">Build a Deck →</a>
          </div>
        </div>

        <div>
          <span style="font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 10px;">02 • USER-CENTRIC DECK BUILDER</span>
          <h2 style="font-size: 30px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; font-family: var(--font-heading);">
            Flexible deck building for every player and collector.
          </h2>
          
          <div class="text-backdrop-card">
            <p style="color: var(--text-primary); font-size: 14px; line-height: 1.6;">
              Whether you're crafting casual 25-card concept decks, building theme decks for kitchen-table play, theorycrafting strategies, or preparing full 60-card tournament lists, DECK / divider makes deck building intuitive and simple.
            </p>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap; font-size: 11px; font-family: var(--font-num);">
            <span style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 4px; color: var(--text-secondary);">Casual & Tournament Decks</span>
            <span style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 4px; color: var(--text-secondary);">Public Share Links (Stack+)</span>
            <span style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 4px; color: var(--text-secondary);">PTCGL Deck Export</span>
          </div>
        </div>
      </div>

      <div class="glass-slab-divider"></div>

      <!-- Feature 03: Clear Previews, Graded Slabs & Binders -->
      <div id="vault" class="feature-z-row">
        <div>
          <span style="font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 10px;">03 • SLABS, BINDERS & CUSTOM LISTS</span>
          <h2 style="font-size: 30px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; font-family: var(--font-heading);">
            Clean card previews, graded slabs & custom binders.
          </h2>
          
          <div class="text-backdrop-card">
            <p style="color: var(--text-primary); font-size: 14px; line-height: 1.6;">
              Organize your collection with 3x3 digital binders, log PSA, BGS, and CGC graded cards with certificate tags, or create custom lists like Wishlists, Trade Binders, and Set Completion checklists.
            </p>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap; font-size: 11px; font-family: var(--font-num);">
            <span style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 4px; color: var(--text-secondary);">3x3 Digital Binders</span>
            <span style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 4px; color: var(--text-secondary);">PSA, BGS & CGC Slabs</span>
            <span style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 4px; color: var(--text-secondary);">Custom Binders & Lists</span>
          </div>
        </div>

        <div class="glass-panel" style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px;">
          <!-- Card Preview -->
          <div class="holo-card-container" style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 10px; padding: 8px; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; font-weight: 700; margin-bottom: 6px;">
              <span>Charizard ex</span>
              <span style="color: var(--accent); font-family: var(--font-num);">330 HP</span>
            </div>
            <div class="card-aspect-frame" style="margin-bottom: 8px;">
              <img src="https://assets.tcgdex.net/en/sv/sv03.5/199/high.png" alt="Charizard ex" class="card-aspect-image" />
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; font-family: var(--font-num);">
              <span style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 1px 5px; border-radius: 3px; font-weight: 600;">SIR Card</span>
              <strong>$112.50</strong>
            </div>
          </div>

          <!-- PSA Slab Preview -->
          <div class="holo-card-container" style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 10px; padding: 8px; display: flex; flex-direction: column;">
            <div style="background: #FFFFFF; border: 1px solid #EF4444; border-bottom: 2px solid #DC2626; padding: 4px; border-radius: 5px 5px 0 0; margin-bottom: 6px; text-align: center;">
              <div style="font-weight: 800; font-size: 10px; color: #B91C1C; letter-spacing: 0.05em;">PSA 10 GEM MINT</div>
              <div style="font-family: var(--font-num); font-size: 8px; color: var(--text-secondary);">CERT #84729104</div>
            </div>
            <div class="card-aspect-frame" style="margin-bottom: 6px;">
              <img src="https://assets.tcgdex.net/en/swsh/swsh11/131/high.png" alt="Giratina VSTAR PSA 10" class="card-aspect-image" />
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; font-family: var(--font-num);">
              <span style="color: var(--text-secondary);">Giratina VSTAR</span>
              <strong>$450.00</strong>
            </div>
          </div>
        </div>
      </div>

    </section>

    <div class="glass-slab-divider"></div>

    <!-- COMPARISON MATRIX -->
    <section id="comparison" style="padding: 38px 24px; max-width: 1100px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 28px;">
        <span style="font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 8px;">PLATFORM COMPARISON</span>
        <h2 style="font-size: 28px; font-weight: 700; color: var(--text-primary); font-family: var(--font-heading);">
          How DECK / divider compares to other apps.
        </h2>
      </div>

      <div class="glass-panel" style="padding: 24px; overflow-x: auto;">
        <table class="matrix-table">
          <thead>
            <tr>
              <th>Feature / Utility</th>
              <th>DECK / divider</th>
              <th>Collectr</th>
              <th>Dragon Shield</th>
              <th>TCGPlayer App</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Custom Deck Builder & PTCGL Export</strong></td>
              <td class="matrix-check">✓ Full Deck Builder</td>
              <td class="matrix-cross">✕ Portfolio Only</td>
              <td class="matrix-check">✓ Basic List</td>
              <td class="matrix-cross">✕ Store Cart Only</td>
            </tr>
            <tr>
              <td><strong>Public Link Sharing for Decks & Lists</strong></td>
              <td class="matrix-check">✓ Public Links (Stack+)</td>
              <td class="matrix-cross">✕ Limited Share</td>
              <td class="matrix-cross">✕ No Share Links</td>
              <td class="matrix-cross">✕ No Share Links</td>
            </tr>
            <tr>
              <td><strong>Dual Currency USD & EUR Live Market Data</strong></td>
              <td class="matrix-check">✓ TCGPlayer & CardMarket</td>
              <td class="matrix-cross">✕ Delayed USD</td>
              <td class="matrix-cross">✕ EUR Focus</td>
              <td class="matrix-cross">✕ USD Only</td>
            </tr>
            <tr>
              <td><strong>Graded Slabs (PSA, BGS & CGC)</strong></td>
              <td class="matrix-check">✓ Full Slab Tagging</td>
              <td class="matrix-check">✓ Basic Slabs</td>
              <td class="matrix-cross">✕ Raw Cards Only</td>
              <td class="matrix-cross">✕ Raw Cards Only</td>
            </tr>
            <tr>
              <td><strong>Custom Lists & Binders</strong></td>
              <td class="matrix-check">✓ Unlimited on Top Tier</td>
              <td class="matrix-cross">✕ Standard Folders</td>
              <td class="matrix-cross">✕ Folders Only</td>
              <td class="matrix-cross">✕ Single Wishlist</td>
            </tr>
            <tr>
              <td><strong>Safe Tier Upgrades & Continuous Storage</strong></td>
              <td class="matrix-check">✓ Non-Destructive Vaulting</td>
              <td class="matrix-cross">✕ Hard Cap Block</td>
              <td class="matrix-cross">✕ Hard Limit</td>
              <td class="matrix-cross">✕ N/A</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="glass-slab-divider"></div>

    <!-- ACCURATE PRICING SECTION -->
    <section id="pricing" style="padding: 48px 24px;">
      <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
        <span style="font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 8px;">ACCURATE TRANSPARENT PRICING</span>
        <h2 style="font-size: 32px; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; font-family: var(--font-heading);">
          Simple Account Plans & Exact Tier Limits.
        </h2>
        
        <div class="text-backdrop-card" style="max-width: 680px; margin: 0 auto 32px; text-align: center;">
          <p style="color: var(--text-primary); font-size: 14px;">
            Choose the plan that fits your deck building and collecting needs. Upgrade or adjust your subscription anytime with full continuous data safety.
          </p>
        </div>

        <div class="glass-panel" style="padding: 24px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; align-items: stretch;">
            
            <!-- Tier 1: Starter ($0/mo) -->
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px 14px; display: flex; flex-direction: column; justify-content: space-between; text-align: center;">
              <div>
                <div style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">FREE TIER</div>
                <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Starter</h3>
                <div style="font-size: 24px; font-weight: 700; font-family: var(--font-num); margin-bottom: 2px;">$0</div>
                <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 16px;">Free Forever</div>
                <div style="border-top: 1px solid var(--border-color); padding-top: 12px; text-align: left; font-size: 11px; display: flex; flex-direction: column; gap: 6px;">
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Decks:</span><strong>4 Decks</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Cards / Deck:</span><strong>Up to 25</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Custom Lists:</span><strong>3 Lists</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Items / List:</span><strong>Up to 20</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Slab Certs:</span><strong>5 Certs</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Public Links:</span><span style="color: #94A3B8;">Disabled</span></div>
                </div>
              </div>
              <a href="/app" class="btn-outline" style="margin-top: 20px; width: 100%; font-size: 11px; padding: 8px 12px;">Start Free</a>
            </div>

            <!-- Tier 2: Bunch ($11/mo) -->
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px 14px; display: flex; flex-direction: column; justify-content: space-between; text-align: center;">
              <div>
                <div style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">ACTIVE PLAYER</div>
                <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Bunch</h3>
                <div style="font-size: 24px; font-weight: 700; font-family: var(--font-num); margin-bottom: 2px;">$11<span style="font-size: 11px; font-weight: 400; color: var(--text-secondary);">/mo</span></div>
                <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 16px;">Billed monthly</div>
                <div style="border-top: 1px solid var(--border-color); padding-top: 12px; text-align: left; font-size: 11px; display: flex; flex-direction: column; gap: 6px;">
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Decks:</span><strong>9 Decks</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Cards / Deck:</span><strong>Up to 40</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Custom Lists:</span><strong>8 Lists</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Items / List:</span><strong>Up to 50</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Slab Certs:</span><strong>15 Certs</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Public Links:</span><span style="color: #94A3B8;">Disabled</span></div>
                </div>
              </div>
              <a href="/app" class="btn-outline" style="margin-top: 20px; width: 100%; font-size: 11px; padding: 8px 12px;">Select Bunch</a>
            </div>

            <!-- Tier 3: Stack ($22/mo - Featured) -->
            <div style="background: var(--bg-primary); border: 2px solid var(--accent); border-radius: 8px; padding: 20px 14px; display: flex; flex-direction: column; justify-content: space-between; text-align: center; position: relative;">
              <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--accent); color: white; font-size: 8px; font-weight: 700; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.05em;">POPULAR</div>
              <div>
                <div style="font-size: 10px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">RECOMMENDED</div>
                <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Stack</h3>
                <div style="font-size: 24px; font-weight: 700; font-family: var(--font-num); margin-bottom: 2px;">$22<span style="font-size: 11px; font-weight: 400; color: var(--text-secondary);">/mo</span></div>
                <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 16px;">Billed monthly</div>
                <div style="border-top: 1px solid var(--border-color); padding-top: 12px; text-align: left; font-size: 11px; display: flex; flex-direction: column; gap: 6px;">
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Decks:</span><strong>15 Decks</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Cards / Deck:</span><strong>Up to 50</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Custom Lists:</span><strong>15 Lists</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Items / List:</span><strong>Up to 100</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Slab Certs:</span><strong>40 Certs</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Public Links:</span><strong style="color: var(--success);">✓ Enabled</strong></div>
                </div>
              </div>
              <a href="/app" class="btn-crimson" style="margin-top: 20px; width: 100%; font-size: 11px; padding: 8px 12px;">Select Stack</a>
            </div>

            <!-- Tier 4: Deck ($33/mo - Full 60 Card Decks) -->
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px 14px; display: flex; flex-direction: column; justify-content: space-between; text-align: center;">
              <div>
                <div style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">FULL DECK CAPACITY</div>
                <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Deck</h3>
                <div style="font-size: 24px; font-weight: 700; font-family: var(--font-num); margin-bottom: 2px;">$33<span style="font-size: 11px; font-weight: 400; color: var(--text-secondary);">/mo</span></div>
                <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 16px;">Billed monthly</div>
                <div style="border-top: 1px solid var(--border-color); padding-top: 12px; text-align: left; font-size: 11px; display: flex; flex-direction: column; gap: 6px;">
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Decks:</span><strong>18 Decks</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Cards / Deck:</span><strong>60 Full Cards</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Custom Lists:</span><strong>25 Lists</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Items / List:</span><strong>Up to 200</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Slab Certs:</span><strong>100 Certs</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Public Links:</span><strong style="color: var(--success);">✓ Enabled</strong></div>
                </div>
              </div>
              <a href="/app" class="btn-outline" style="margin-top: 20px; width: 100%; font-size: 11px; padding: 8px 12px;">Select Deck</a>
            </div>

            <!-- Tier 5: Collection ($44/mo - Unlimited) -->
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px 14px; display: flex; flex-direction: column; justify-content: space-between; text-align: center;">
              <div>
                <div style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">UNLIMITED ACCESS</div>
                <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Collection</h3>
                <div style="font-size: 24px; font-weight: 700; font-family: var(--font-num); margin-bottom: 2px;">$44<span style="font-size: 11px; font-weight: 400; color: var(--text-secondary);">/mo</span></div>
                <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 16px;">Billed monthly</div>
                <div style="border-top: 1px solid var(--border-color); padding-top: 12px; text-align: left; font-size: 11px; display: flex; flex-direction: column; gap: 6px;">
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Decks:</span><strong>Unlimited</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Cards / Deck:</span><strong>Unlimited</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Custom Lists:</span><strong>Unlimited</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Items / List:</span><strong>Unlimited</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Slab Certs:</span><strong>Unlimited</strong></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">Public Links:</span><strong style="color: var(--success);">✓ Enabled</strong></div>
                </div>
              </div>
              <a href="/app" class="btn-outline" style="margin-top: 20px; width: 100%; font-size: 11px; padding: 8px 12px;">Select Collection</a>
            </div>

          </div>
        </div>
      </div>
    </section>

    <div class="glass-slab-divider"></div>

    <!-- JOURNAL / ARTICLES SECTION -->
    <section id="articles" style="padding: 48px 24px; max-width: 1200px; margin: 0 auto;">
      <div class="feature-z-row">
        <div>
          <span style="font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 10px;">04 • COLLECTOR JOURNAL & GUIDES</span>
          <h2 style="font-size: 28px; font-weight: 700; color: var(--text-primary); margin-bottom: 14px; font-family: var(--font-heading);">
            Useful articles for collectors and players.
          </h2>
          
          <div class="text-backdrop-card">
            <p style="color: var(--text-primary); font-size: 14px; line-height: 1.6;">
              Clear guides on Pokémon card grading differences, set completion tracking, custom deck building, and sealed box storage.
            </p>
          </div>
        </div>

        <div class="glass-panel" style="padding: 20px;">
          <div class="scrollable-articles-frame">
            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${BLOG_ARTICLES.map(art => `
                <article style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; transition: border-color 220ms ease;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 10px; font-family: var(--font-num);">
                    <span style="font-weight: 700; color: var(--accent); text-transform: uppercase;">${art.category}</span>
                    <span style="color: var(--text-secondary);">${art.date} • ${art.readTime}</span>
                  </div>
                  <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; line-height: 1.35; font-family: var(--font-heading);">
                    ${art.title}
                  </h3>
                  <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
                    ${art.excerpt}
                  </p>
                  <details style="font-size: 12px; color: var(--text-primary);">
                    <summary style="cursor: pointer; font-weight: 600; font-size: 11px; color: var(--accent); font-family: var(--font-ui); outline: none;">
                      Read Article ↓
                    </summary>
                    <div style="margin-top: 12px; border-top: 1px solid var(--border-color); padding-top: 12px;">
                      ${art.content}
                    </div>
                  </details>
                </article>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="glass-slab-divider"></div>

    <!-- FREQUENTLY ASKED QUESTIONS -->
    <section id="faq" style="padding: 48px 24px;">
      <div style="max-width: 840px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 8px;">FREQUENTLY ASKED QUESTIONS</span>
          <h2 style="font-size: 30px; font-weight: 700; color: var(--text-primary); font-family: var(--font-heading);">
            Frequently Asked Questions.
          </h2>
        </div>

        <details class="faq-item" open>
          <summary class="faq-summary">
            <span>Where do market prices come from?</span>
            <span style="color: var(--accent); font-weight: 700;">+</span>
          </summary>
          <div class="faq-content">
            Market prices are updated live from TCGPlayer Market APIs for USD values and CardMarket spot trends for EUR values.
          </div>
        </details>

        <details class="faq-item">
          <summary class="faq-summary">
            <span>Can I build casual decks or theme decks?</span>
            <span style="color: var(--accent); font-weight: 700;">+</span>
          </summary>
          <div class="faq-content">
            Yes! You can create custom decks of any size up to your tier limit (e.g. 25 cards on Starter tier up to 60 full cards on Deck tier and unlimited on Collection tier). You can use decks for casual play, theorycrafting, or tournament testing.
          </div>
        </details>

        <details class="faq-item">
          <summary class="faq-summary">
            <span>How does public link sharing work?</span>
            <span style="color: var(--accent); font-weight: 700;">+</span>
          </summary>
          <div class="faq-content">
            Subscribers on Stack tier ($22/mo), Deck tier ($33/mo), and Collection tier ($44/mo) can toggle public share links for any deck or custom list to send directly to friends or social media.
          </div>
        </details>

        <details class="faq-item">
          <summary class="faq-summary">
            <span>What happens to my cards if I change or downgrade my subscription?</span>
            <span style="color: var(--accent); font-weight: 700;">+</span>
          </summary>
          <div class="faq-content">
            Your card data is never deleted. Under our safe continuous storage policy, extra cards beyond a lower tier's limit are kept safely in a preserved locked state until you expand your tier again.
          </div>
        </details>

        <details class="faq-item">
          <summary class="faq-summary">
            <span>Can I export decks to Pokémon TCG Live (PTCGL)?</span>
            <span style="color: var(--accent); font-weight: 700;">+</span>
          </summary>
          <div class="faq-content">
            Yes. With one click, you can export any deck list into standard PTCGL text format to paste directly into Pokémon TCG Live.
          </div>
        </details>
      </div>
    </section>

    <!-- CALL TO ACTION BANNER -->
    <section style="padding: 64px 24px; text-align: center;">
      <div class="glass-panel" style="max-width: 880px; margin: 0 auto; padding: 40px 32px; background: rgba(255, 255, 255, 0.95);">
        <h2 style="font-size: 32px; font-weight: 700; color: var(--text-primary); margin-bottom: 14px; font-family: var(--font-heading);">
          Ready to organize your collection and deck builds?
        </h2>
        <p style="color: var(--text-secondary); font-size: 15px; max-width: 580px; margin: 0 auto 28px; line-height: 1.6;">
          Join Pokémon TCG collectors and players using DECK / divider today. Free Starter account available with no credit card required.
        </p>
        <div style="display: flex; gap: 16px; justify-content: center; align-items: center;">
          <a href="/app" class="btn-crimson" style="padding: 12px 32px; font-size: 14px;">Open Portfolio App Studio</a>
        </div>
      </div>
    </section>

  </div>
`;

marketingRoutes.get('/', (req, res) => {
  const page = renderHeader('DECK / divider — Pokémon TCG Portfolio & Deck Builder', 'Complete Pokémon TCG portfolio management, custom deck builder, digital binders, and market pricing.') +
    monolithBody +
    renderFooter();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(page);
});

marketingRoutes.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`);
});

marketingRoutes.get('/sitemap.xml', (req, res) => {
  const host = `${req.protocol}://${req.get('host')}`;
  res.setHeader('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${host}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${host}/app</loc><changefreq>always</changefreq><priority>0.9</priority></url>
  <url><loc>${host}/#features</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${host}/#vault</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${host}/#decks</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${host}/#comparison</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>${host}/#pricing</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${host}/#articles</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
</urlset>`);
});
