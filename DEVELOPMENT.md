# Developer Setup & Reproduction Manual

This guide walks through setting up a local development environment for **DECK / divider** to enable private testing, security auditing, and code inspection.

---

## 1. Prerequisites

Before setting up the project locally, ensure you have the following installed:

- **Node.js**: Version 20.x or 22.x LTS (Recommended: Node 22)
- **npm**: Version 10.x or higher
- **Git**: Latest stable release
- **Browser**: Modern Chromium (Chrome/Edge/Brave), Firefox, or Safari with IndexedDB support

Check your versions:
```bash
node -v   # v22.x.x
npm -v    # 10.x.x
```

---

## 2. Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/deck-divider.git
cd deck-divider

# 2. Install all dependencies from package.json
npm install

# 3. Create your local environment configuration file
cp .env.example .env
```

---

## 3. Environment Variables Configuration

The `.env` file controls runtime configurations. Most external API keys are optional for basic local UI inspection, as DECK / divider includes mock fallbacks and local IndexedDB storage.

### Client-Side Variables (Prefixed with `VITE_`)
These variables are bundled by Vite and exposed to the browser:

| Variable | Description | Required for Local Dev? |
| :--- | :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key for optional user authentication | Optional |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain (e.g., `project.firebaseapp.com`) | Optional |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | Optional |
| `VITE_FIREBASE_STORAGE_BUCKET` | Cloud Storage bucket URL | Optional |
| `VITE_SENTRY_DSN` | Sentry DSN for frontend crash telemetry | Optional |

### Server-Side Variables (Secrets — Never Expose to Browser)
These variables are read exclusively by Node.js in `server.ts`:

| Variable | Description | Required for Local Dev? |
| :--- | :--- | :--- |
| `EXCHANGE_RATE_API_KEY` | API key from exchangerate-api.com for live forex sync | Optional (cached fallbacks active) |
| `GEMINI_API_KEY` | Google Gemini API key for server-side generation | Optional |
| `PAYPAL_MODE` | PayPal integration mode: `sandbox` or `live` | Optional (default: `live`) |
| `PAYPAL_CLIENT_ID` | PayPal REST App Client ID | Optional |
| `PAYPAL_CLIENT_SECRET` | PayPal REST App Secret | Optional |
| `FIREBASE_PROJECT_ID` | Firebase Admin SDK project ID | Optional |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin service account email | Optional |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin private RSA key | Optional |
| `SENTRY_DSN` | Sentry DSN for server-side profiling and error tracking | Optional |

---

## 4. Available NPM Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `tsx server.ts` | **Starts full-stack development server on port 3000** with hot Vite middlewares. |
| `npm run lint` | `tsc --noEmit` | **Type-checks the entire TypeScript codebase** (zero emit). |
| `npm run build` | `tsx scripts/generateAllIcons.ts && vite build && tsx scripts/prerender.ts && esbuild server.ts ...` | **Full production compilation**: generates icons, bundles Vite SPA, runs static pre-renderer, and bundles server into `dist/server.cjs`. |
| `npm start` | `NODE_ENV=production node dist/server.cjs` | Runs the compiled production server. |
| `npm run icons` | `tsx scripts/generateAllIcons.ts` | Regenerates PWA, favicon, and SEO icons via Sharp. |
| `npm run clean` | `rm -rf dist server.js dist/server.cjs` | Cleans previous build output. |

---

## 5. Development Workflow

### Starting the Server
```bash
npm run dev
```

The terminal will log:
```
Server listening on port 3000
Vite development middleware mounted
Ready for requests at http://localhost:3000
```

### Inspecting Machine Endpoints
To verify the Generative Engine Optimization (GEO) and dynamic markdown negotiation:

```bash
# Test robots.txt crawler policy
curl http://localhost:3000/robots.txt

# Test LLMs context file
curl http://localhost:3000/llms.txt

# Test machine-readable markdown mirror routes
curl http://localhost:3000/compare.md
curl http://localhost:3000/decks.md
curl http://localhost:3000/pricing.md

# Test dynamic content negotiation via headers
curl -H "Accept: text/markdown" http://localhost:3000/
curl -H "User-Agent: PerplexityBot/1.0" http://localhost:3000/
```

---

## 6. Project Structure Overview

```
deck-divider/
├── public/                 # Static assets, sitemaps, robots.txt, llms.txt, icons
├── scripts/                # Build scripts (prerender.ts, generateAllIcons.ts)
├── server/                 # Server modules (Express, TCG catalog, markdown negotiator)
│   ├── middleware/         # Auth, rate limiting
│   ├── routes/             # API routes, cert routes
│   ├── services/           # Subscription governor, scrapers, cert resolvers
│   ├── indexNow.ts         # IndexNow SEO push
│   ├── markdownNegotiator.ts # Dynamic CommonMark engine
│   └── tcgCatalogManager.ts # Card & set cache
├── src/                    # Frontend React 19 application
│   ├── components/         # UI components, modals, landing sections
│   ├── config/             # Entitlements, legality rules, platform config
│   ├── data/               # Meta decks, catalog stats, starter sample data
│   ├── lib/                # Search engine, IndexedDB, Firebase, analytics
│   ├── utils/              # Formatting, forex metronome, legality checkers
│   ├── views/              # View screens (App, Public, Marketing, Legal)
│   ├── App.tsx             # Root application orchestrator
│   └── main.tsx            # React DOM entry point
├── server.ts               # Express server entry point (port 3000)
├── vite.config.ts          # Vite configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

---

## 7. Troubleshooting

### Port 3000 Already in Use
If port 3000 is occupied by another process:
```bash
# On Linux / macOS
lsof -ti :3000 | xargs kill -9
```

### Resetting Local Browser State
If you wish to test a completely clean guest onboarding flow:
1. Open Browser DevTools (`F12`).
2. Go to **Application** > **Storage**.
3. Click **Clear site data** (clears `IndexedDB`, `localStorage`, and `sessionStorage`).
4. Reload the page at `http://localhost:3000`.

### Type Checking
To run a fast lint without launching the dev server:
```bash
npm run lint
```
All files must pass with zero TypeScript errors.
