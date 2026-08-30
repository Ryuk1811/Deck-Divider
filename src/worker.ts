/**
 * Cloudflare Worker Entry Point for DECK / divider
 * Supports:
 * - Direct Cloudflare Workers deployment with Static Assets (`wrangler deploy`)
 * - Cloudflare Pages deployment (`wrangler pages deploy dist`)
 * - Edge API proxying, currency exchange, TCG search & PayPal integration
 */

import { onRequest } from '../functions/api/[[catchall]]';

export interface WorkerEnv {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PAYPAL_MODE?: string;
  PAYPAL_PLAN_BUNCH?: string;
  PAYPAL_PLAN_STACK?: string;
  PAYPAL_PLAN_DECK?: string;
  PAYPAL_PLAN_COLLECTION?: string;
  EXCHANGE_RATE_API_KEY?: string;
  GEMINI_API_KEY?: string;
  BACKEND_URL?: string;
  [key: string]: any;
}

export interface WorkerExecutionContext {
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException?: () => void;
}

export default {
  async fetch(request: Request, env: WorkerEnv, ctx: WorkerExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. Route API requests to the edge handler
    if (url.pathname.startsWith('/api/')) {
      return onRequest({
        request,
        env,
        params: {},
        waitUntil: (p: Promise<any>) => ctx.waitUntil(p),
        next: () => Promise.resolve(new Response('Not found', { status: 404 })),
        data: {},
      });
    }

    // 2. Serve static assets if binding exists (Workers with Assets)
    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
      // SPA Fallback: serve index.html for non-asset routes
      const indexReq = new Request(new URL('/index.html', request.url).toString(), request);
      return env.ASSETS.fetch(indexReq);
    }

    // 3. Fallback response if static asset binding is not present
    return new Response('DECK / divider Cloudflare Edge Worker active.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
