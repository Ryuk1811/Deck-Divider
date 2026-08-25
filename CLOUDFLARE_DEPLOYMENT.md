# Cloudflare Workers & Pages Deployment Guide

DECK / divider is fully configured for zero-cold-start, globally distributed edge deployment via **Cloudflare Workers (with Static Assets support)**.

---

## 1. Cloudflare Configuration Overview

* **Cloudflare Account ID**: `82194e5cb26731579613ad66f0af25e1`
* **Worker Entry Point**: `worker.ts` (powered by Hono router for `/api/*` routes)
* **Static Assets Directory**: `./dist` (Vite production bundle, served globally with SPA routing fallback)
* **Node.js Compatibility**: `nodejs_compat` enabled

---

## 2. One-Click Deployment Commands

### Deploy directly using Wrangler:
```bash
# Set your Cloudflare API Token in your terminal
export CLOUDFLARE_API_TOKEN="cfat_UvFHV916iQaJUqgMrSmNbsroNYWN51UfMjkQW8ai5500cb53"

# Run the deployment command
npm run deploy
```

### Preview locally with Cloudflare runtime:
```bash
npm run cf:dev
```

---

## 3. Setting Production Secrets on Cloudflare

To attach live production secrets (e.g. PayPal, Firebase Admin, API keys) securely to your Cloudflare Worker:

```bash
# 1. PayPal Production Secrets
npx wrangler secret put PAYPAL_CLIENT_ID
npx wrangler secret put PAYPAL_CLIENT_SECRET
npx wrangler secret put PAYPAL_PLAN_BUNCH
npx wrangler secret put PAYPAL_PLAN_STACK
npx wrangler secret put PAYPAL_PLAN_DECK
npx wrangler secret put PAYPAL_PLAN_COLLECTION

# 2. Firebase Admin Private Keys
npx wrangler secret put FIREBASE_PRIVATE_KEY
npx wrangler secret put FIREBASE_CLIENT_EMAIL

# 3. Live Forex Rates & AI API
npx wrangler secret put EXCHANGE_RATE_API_KEY
npx wrangler secret put GEMINI_API_KEY
```

Alternatively, you can configure these secrets under **Cloudflare Dashboard > Workers & Pages > deck-divider > Settings > Variables and Secrets**.

---

## 4. R2 Storage Credentials (Optional Asset Storage)

Your S3-compatible R2 storage credentials:
* **Account ID**: `82194e5cb26731579613ad66f0af25e1`
* **Access Key ID**: `d9c8ce53112a6ed95148b5e8d02196a7`
* **S3 Endpoint**: `https://82194e5cb26731579613ad66f0af25e1.r2.cloudflarestorage.com`

---

## 5. Architectural Flow

```
[User Browser]
       │
       ▼
[Cloudflare Edge Network]
       │
       ├──► /api/* ─────────► [worker.ts / Hono Edge Compute]
       │                        ├── TCGdex Proxy & Edge Caching
       │                        ├── Graded Market & Cert Engine
       │                        ├── Multi-Currency Live Forex
       │                        └── PayPal / Tier Verification
       │
       └──► /* (Static Assets) ──► [Vite SPA Bundle in dist/]
                                    (Instant edge cache + deep link routing)
```
