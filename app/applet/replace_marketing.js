const fs = require('fs');

let content = fs.readFileSync('server/marketing.ts', 'utf8');

const newCss = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@500;600;700&display=swap');

  :root {
    --bg-primary: #FFFFFF;
    --bg-secondary: #F9F9F9;
    --border-color: #EBEBEB;
    --text-primary: #111111;
    --text-secondary: #666666;
    --accent: #DC143C;
    --accent-hover: #B01030;
    --accent-subtle: #FFF0F3;
    --success: #16A34A;
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
    background-image: radial-gradient(#CBD5E1 1.2px, transparent 1.2px);
    background-size: 16px 16px;
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

  /* Structural Panels */
  .matte-panel {
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 48px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  }

  /* Luxury Buttons */
  .btn-crimson {
    background-color: var(--accent);
    color: #FFFFFF;
    padding: 12px 24px;
    border-radius: 4px;
    text-decoration: none;
    font-family: var(--font-ui);
    font-size: 13px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    cursor: pointer;
    white-space: nowrap;
  }

  .btn-crimson:hover {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 20, 60, 0.2);
  }

  .btn-outline {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    padding: 12px 24px;
    border-radius: 4px;
    text-decoration: none;
    font-family: var(--font-ui);
    font-size: 13px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid var(--border-color);
    transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    white-space: nowrap;
  }

  .btn-outline:hover {
    background-color: var(--bg-secondary);
    border-color: #CBD5E1;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
  }

  /* Mockup Utilities */
  .glass-panel {
    background-color: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.05);
  }

  .kpi-card {
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 24px;
    transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .kpi-card:hover {
    border-color: #CBD5E1;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  }

  .pokemon-card-replica {
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 12px;
    transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 220px;
  }
  
  .pokemon-card-replica:hover {
    border-color: var(--accent);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  }

  .set-card-replica {
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
    transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .set-card-replica:hover {
    border-color: #CBD5E1;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
  }

  /* Navbar */
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
    height: 64px;
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
    font-size: 18px;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 24px;
    list-style: none;
  }

  .nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    transition: color 220ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-links a:hover {
    color: var(--text-primary);
  }

  /* Footer */
  .footer {
    border-top: 1px solid var(--border-color);
    background-color: var(--bg-primary);
    padding: 64px 24px 32px;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr repeat(3, 1fr);
    gap: 48px;
  }

  .footer-brand {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 12px;
  }

  .footer-desc {
    color: var(--text-secondary);
    font-size: 13px;
    max-width: 320px;
    line-height: 1.6;
  }

  .footer-col-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-primary);
    margin-bottom: 16px;
  }

  .footer-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 13px;
    transition: color 220ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .footer-links a:hover {
    color: var(--text-primary);
  }

  .footer-bottom {
    max-width: 1200px;
    margin: 48px auto 0;
    padding-top: 24px;
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

const cssStartMarker = "const COMMON_CSS = `";
const headerStartMarker = "function renderHeader";

let cssStartIdx = content.indexOf(cssStartMarker);
let headerStartIdx = content.indexOf(headerStartMarker);

if (cssStartIdx !== -1 && headerStartIdx !== -1) {
  content = content.substring(0, cssStartIdx) + cssStartMarker + "\\n" + newCss + "\\n`;\\n\\n" + content.substring(headerStartIdx);
}

const homeRouteStart = "marketingRoutes.get('/', (req, res) => {";
const featuresRouteStart = "marketingRoutes.get('/features', (req, res) => {";

const homeIdx = content.indexOf(homeRouteStart);
const featuresIdx = content.indexOf(featuresRouteStart);

const newHomeRoute = `marketingRoutes.get('/', (req, res) => {
  const html = \`
    \${renderHeader('Pokemon TCG Portfolio & Deck Studio', 'Track your Pokemon collection with real depth and zero AI guessing. Factual TCGPlayer and CardMarket market data.')}

    <!-- Hero Section -->
    <section style="padding: 96px 24px 64px; overflow: hidden; position: relative;">
      <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
        
        <!-- Status Ticker Bar -->
        <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; padding: 6px 16px; background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 20px; color: var(--text-secondary); margin-bottom: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="color: var(--success); font-size: 8px;">●</span> TCGPlayer & CardMarket Feeds Active • H-I-J Block Compliant • 1.2M+ Indexed Cards
        </div>

        <!-- Headline Area -->
        <h1 style="font-size: 48px; font-weight: 700; color: var(--text-primary); line-height: 1.15; margin-bottom: 24px; font-family: var(--font-heading); max-width: 840px; margin-left: auto; margin-right: auto;">
          Track your Pokémon collection with real depth and zero AI guessing.
        </h1>
        
        <p style="font-size: 16px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 48px; max-width: 660px; margin-left: auto; margin-right: auto;">
          Factual TCGPlayer and CardMarket market feeds, real 60-card tournament deck architecture with custom color themes, and strict expansion set segregation.
        </p>

        <!-- CTA Action Buttons -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 72px;">
          <a href="/app" class="btn-crimson" style="padding: 14px 32px; font-size: 14px;">Open Studio</a>
          <a href="/pricing" class="btn-outline" style="padding: 14px 32px; font-size: 14px;">See Pricing</a>
        </div>

        <!-- PORTFOLIO ANALYTICS DASHBOARD MOCKUP -->
        <div class="glass-panel" style="max-width: 1140px; margin: 0 auto; padding: 32px; text-align: left; position: relative; z-index: 10;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px;">
            <div style="display: flex; gap: 16px; align-items: center;">
              <span style="font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.05em; text-transform: uppercase; border: 1px solid var(--accent); padding: 4px 8px; border-radius: 4px;">Portfolio Analytics</span>
              <span style="font-size: 15px; font-weight: 600; font-family: var(--font-heading);">Metrics & Performance</span>
            </div>
            <div style="font-size: 12px; font-family: var(--font-ui); background: var(--text-primary); color: var(--bg-primary); padding: 8px 16px; border-radius: 4px; font-weight: 600;">View Inventory</div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
            <!-- KPI 1 -->
            <div class="kpi-card">
              <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 12px; display: flex; justify-content: space-between;">Holdings Value <span style="color: var(--accent); border: 1px solid var(--accent-subtle); background: var(--accent-subtle); padding: 2px 6px; border-radius: 4px;">$</span></div>
              <div style="font-family: var(--font-num); font-size: 28px; font-weight: 700; margin-bottom: 8px;">$14,850.00</div>
              <div style="font-size: 11px; color: var(--text-secondary);">1,452 cards across 8 active decks</div>
            </div>
            <!-- KPI 2 -->
            <div class="kpi-card">
              <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 12px; display: flex; justify-content: space-between;">Cost Basis <span style="border: 1px solid var(--border-color); padding: 2px 6px; border-radius: 4px;">💼</span></div>
              <div style="font-family: var(--font-num); font-size: 28px; font-weight: 700; margin-bottom: 8px;">$9,200.00</div>
              <div style="font-size: 11px; color: var(--text-secondary);">Total acquisition expenditure</div>
            </div>
            <!-- KPI 3 -->
            <div class="kpi-card">
              <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 12px; display: flex; justify-content: space-between;">Unrealized P&L <span style="color: var(--success); border: 1px solid #DCFCE7; background: #F0FDF4; padding: 2px 6px; border-radius: 4px;">↗</span></div>
              <div style="font-family: var(--font-num); font-size: 28px; font-weight: 700; color: var(--success); margin-bottom: 8px;">+$5,650.00</div>
              <div style="font-size: 11px; color: var(--text-secondary);">+61.4% net return on investment</div>
            </div>
            <!-- KPI 4 -->
            <div class="kpi-card">
              <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 12px; display: flex; justify-content: space-between;">Realized Profit <span style="color: #D97706; border: 1px solid #FEF3C7; background: #FFFBEB; padding: 2px 6px; border-radius: 4px;">✧</span></div>
              <div style="font-family: var(--font-num); font-size: 28px; font-weight: 700; color: #D97706; margin-bottom: 8px;">+$1,240.00</div>
              <div style="font-size: 11px; color: var(--text-secondary);">From 24 completed card sales</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature 01: Card Discovery (Horizontal Track) -->
    <section style="padding: 96px 24px; border-bottom: 1px solid var(--border-color);">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 48px;">
          <span style="font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.05em; text-transform: uppercase;">01 • Card Discovery</span>
          <h2 style="font-size: 32px; font-weight: 700; color: var(--text-primary); margin: 12px 0 16px; font-family: var(--font-heading);">
            Unparalleled search accuracy and variant tracking.
          </h2>
          <p style="color: var(--text-secondary); font-size: 15px; max-width: 600px; margin: 0 auto;">
            Search the entire TCG history. Every printing, reverse holo, stamped promo, and secret rare variant is distinctly cataloged.
          </p>
        </div>

        <div class="glass-panel" style="padding: 24px; overflow-x: auto; white-space: nowrap; display: flex; gap: 16px;">
          <!-- Card Replica 1 -->
          <div class="pokemon-card-replica">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 11px; margin-bottom: 8px;">
              <span>Charizard ex</span>
              <span style="color: var(--accent);">330 HP</span>
            </div>
            <div style="background: #EBEBEB; height: 260px; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-secondary);">Artwork Placeholder</div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-family: var(--font-num);">
              <span style="background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color);">★ SIR</span>
              <span>151 • <strong>$112.50</strong></span>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 12px;">
              <span style="font-size: 9px; color: var(--accent); border: 1px solid var(--accent-subtle); padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Stage 2</span>
              <span style="font-size: 9px; color: var(--accent); border: 1px solid var(--accent-subtle); padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Fire</span>
            </div>
          </div>
          <!-- Card Replica 2 -->
          <div class="pokemon-card-replica">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 11px; margin-bottom: 8px;">
              <span>Giratina VSTAR</span>
              <span style="color: var(--accent);">280 HP</span>
            </div>
            <div style="background: #EBEBEB; height: 260px; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-secondary);">Artwork Placeholder</div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-family: var(--font-num);">
              <span style="background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color);">★ Secret Rare</span>
              <span>CZ • <strong>$94.30</strong></span>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 12px;">
              <span style="font-size: 9px; color: #7C3AED; border: 1px solid #EDE9FE; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">VSTAR</span>
              <span style="font-size: 9px; color: #7C3AED; border: 1px solid #EDE9FE; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Dragon</span>
            </div>
          </div>
          <!-- Card Replica 3 -->
          <div class="pokemon-card-replica">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 11px; margin-bottom: 8px;">
              <span>Team Magma's Camerupt</span>
              <span style="color: var(--accent);">110 HP</span>
            </div>
            <div style="background: #EBEBEB; height: 260px; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-secondary);">Artwork Placeholder</div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-family: var(--font-num);">
              <span style="background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color);">★ Rare</span>
              <span>Double Crisis • <strong>$99.43</strong></span>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 12px;">
              <span style="font-size: 9px; color: var(--accent); border: 1px solid var(--accent-subtle); padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Stage 1</span>
              <span style="font-size: 9px; color: var(--accent); border: 1px solid var(--accent-subtle); padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Fire</span>
            </div>
          </div>
           <!-- Card Replica 4 -->
          <div class="pokemon-card-replica">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 11px; margin-bottom: 8px;">
              <span>Ampharos</span>
              <span style="color: var(--accent);">80 HP</span>
            </div>
            <div style="background: #EBEBEB; height: 260px; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-secondary);">Artwork Placeholder</div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-family: var(--font-num);">
              <span style="background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color);">★ Rare</span>
              <span>Neo Genesis • <strong>$97.31</strong></span>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 12px;">
              <span style="font-size: 9px; color: #D97706; border: 1px solid #FEF3C7; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Stage 2</span>
              <span style="font-size: 9px; color: #D97706; border: 1px solid #FEF3C7; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Electric</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature 02: Expansion Sets Grid -->
    <section style="padding: 96px 24px; border-bottom: 1px solid var(--border-color);">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 48px;">
          <span style="font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.05em; text-transform: uppercase;">02 • Expansion Index</span>
          <h2 style="font-size: 32px; font-weight: 700; color: var(--text-primary); margin: 12px 0 16px; font-family: var(--font-heading);">
            Track master sets with clinical precision.
          </h2>
          <p style="color: var(--text-secondary); font-size: 15px; max-width: 600px; margin: 0 auto;">
            Browse over 220 official expansions. Monitor your master set completion percentages and sealed vault holdings independently.
          </p>
        </div>

        <div class="glass-panel" style="padding: 32px;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
            <div class="set-card-replica">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div>
                  <div style="font-family: var(--font-heading); font-weight: 700; font-size: 15px;">Celebrations</div>
                  <div style="font-size: 11px; color: var(--text-secondary); font-family: var(--font-num);">CEL Series • 2021-10-08</div>
                </div>
                <div style="font-size: 10px; font-family: var(--font-num); background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color);">25 Cards</div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-family: var(--font-num);">
                <span style="color: var(--text-secondary);">Set Code: <strong>CEL25</strong></span>
                <span style="color: var(--accent); font-weight: 700;">Explore Set →</span>
              </div>
            </div>

            <div class="set-card-replica">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div>
                  <div style="font-family: var(--font-heading); font-weight: 700; font-size: 15px;">151</div>
                  <div style="font-size: 11px; color: var(--text-secondary); font-family: var(--font-num);">SV Series • 2023-09-22</div>
                </div>
                <div style="font-size: 10px; font-family: var(--font-num); background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color);">207 Cards</div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-family: var(--font-num);">
                <span style="color: var(--text-secondary);">Set Code: <strong>SV3pt5</strong></span>
                <span style="color: var(--accent); font-weight: 700;">Explore Set →</span>
              </div>
            </div>

            <div class="set-card-replica">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div>
                  <div style="font-family: var(--font-heading); font-weight: 700; font-size: 15px;">Crown Zenith</div>
                  <div style="font-size: 11px; color: var(--text-secondary); font-family: var(--font-num);">SWSH Series • 2023-01-20</div>
                </div>
                <div style="font-size: 10px; font-family: var(--font-num); background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color);">230 Cards</div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-family: var(--font-num);">
                <span style="color: var(--text-secondary);">Set Code: <strong>CRZ</strong></span>
                <span style="color: var(--accent); font-weight: 700;">Explore Set →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature 03: Deck Studio Segmented Controls -->
    <section style="padding: 96px 24px; border-bottom: 1px solid var(--border-color);">
      <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;">
        <div>
          <span style="font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.05em; text-transform: uppercase;">03 • Deck Studio</span>
          <h2 style="font-size: 32px; font-weight: 700; color: var(--text-primary); margin: 12px 0 16px; font-family: var(--font-heading);">
            Tournament deck architecture.
          </h2>
          <p style="color: var(--text-secondary); font-size: 15px; margin-bottom: 24px;">
            Construct tournament-legal 60-card Pokémon lists with live energy curve analysis, card count meters, and custom binder display modes.
          </p>
          <div class="glass-panel" style="padding: 24px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 12px;">Display Mode:</div>
            <div style="display: flex; gap: 8px;">
              <div style="background: var(--text-primary); color: var(--bg-primary); padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: 600;">Binder View</div>
              <div style="background: var(--bg-primary); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: 600;">Ledger Table</div>
              <div style="background: var(--bg-primary); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: 600;">By Expansion</div>
            </div>
          </div>
        </div>
        <div class="matte-panel" style="text-align: center;">
          <div style="font-family: var(--font-heading); font-size: 24px; font-weight: 700; margin-bottom: 12px;">Explore transparent account tiers.</div>
          <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">From free starter tracking to unlimited capacity.</p>
          <a href="/pricing" class="btn-crimson">See Full Pricing</a>
        </div>
      </div>
    </section>

    \${renderFooter()}
  \`;
  res.send(html);
});\n\n`;

if (homeIdx !== -1 && featuresIdx !== -1) {
  content = content.substring(0, homeIdx) + newHomeRoute + content.substring(featuresIdx);
}

// Convert all plain white/secondary backgrounds to transparent or matte-panel so the dot grid is visible
content = content.replace(/background-color: var\\(--bg-primary\\);/g, "background-color: transparent;");
content = content.replace(/background-color: var\\(--bg-secondary\\);/g, "background-color: transparent;");

// Update blog index wrapper
const blogRegex = /<!-- Centered Header without app component mockups -->[\\s\\S]*?<!-- Plain Article List -->/;
content = content.replace(blogRegex, 
  `<!-- Centered Header without app component mockups -->
    <section style="padding: 80px 24px 40px; text-align: center; background-color: transparent; border-bottom: 1px solid var(--border-color);">
      <div style="max-width: 760px; margin: 0 auto;">
        <span style="font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 16px;">TCG META & MARKET ANALYSIS</span>
        <h1 style="font-size: 32px; font-weight: 700; color: var(--text-primary); font-family: var(--font-heading); line-height: 1.3; margin: 0 0 16px;">
          DECK / divider Journal
        </h1>
        <p style="font-size: 16px; color: var(--text-secondary); line-height: 1.6; margin: 0 auto; max-width: 600px;">
          Unvarnished market analysis, grading company comparison metrics, raw-to-graded spread studies, and sealed vault economics.
        </p>
      </div>
    </section>

    <!-- Plain Article List -->`
);

// Style blog articles
content = content.replace(/<article style="background: white;/g, '<article class="matte-panel" style="');

// Style blog specific article
content = content.replace(/<article style="padding: 80px 24px; max-width: 760px; margin: 0 auto;">/g, '<article class="matte-panel" style="max-width: 800px; margin: 64px auto;">');

// Style privacy/terms text bodies
const legalContentStart = '<section style="padding: 64px 24px; background-color: transparent; border-bottom: 1px solid var(--border-color);">';
content = content.replace(new RegExp(legalContentStart.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&') + '\\s*<div style="max-width: 760px; margin: 0 auto; color: var\\(--text-primary\\); font-family: var\\(--font-ui\\); line-height: 1.8; font-size: 15px;">', 'g'), 
  '<section style="padding: 64px 24px; border-bottom: 1px solid var(--border-color); background-color: transparent;"><div class="matte-panel" style="max-width: 840px; margin: 0 auto; color: var(--text-primary); font-family: var(--font-ui); line-height: 1.8; font-size: 15px;">'
);

fs.writeFileSync('server/marketing.ts', content, 'utf8');
console.log("Rewrote marketing.ts successfully");
