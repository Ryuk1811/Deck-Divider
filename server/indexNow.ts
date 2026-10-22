import https from 'https';
import http from 'http';

export interface IndexNowResult {
  success: boolean;
  status?: number;
  count: number;
  endpoint?: string;
  message?: string;
}

export interface SearchEnginePingResult {
  engine: string;
  url: string;
  status: number;
  success: boolean;
}

export interface FullPurgeBroadcastResult {
  timestamp: string;
  totalUrls: number;
  indexNowResults: IndexNowResult[];
  sitemapPingResults: SearchEnginePingResult[];
}

export const INDEXNOW_ENDPOINTS = [
  'api.indexnow.org',
  'www.bing.com',
  'searchadvisor.yandex.ru',
];

export async function pingIndexNow(urls: string[], endpointHost: string = 'api.indexnow.org'): Promise<IndexNowResult[]> {
  // Allow disabling IndexNow in local/dev environments via INDEXNOW_ENABLED=false
  if (process.env.INDEXNOW_ENABLED === 'false') {
    return [{ success: true, count: urls.length, endpoint: endpointHost, message: 'IndexNow disabled via INDEXNOW_ENABLED=false' }];
  }

  const targetHost = process.env.INDEXNOW_HOST || 'deckdivider.app';
  const key = process.env.INDEXNOW_KEY || '7392abcd';
  const keyLocation = `https://${targetHost}/${key}.txt`;

  // Filter and deduplicate valid http/https URLs
  const cleanUrls = Array.from(
    new Set(
      urls
        .filter(u => typeof u === 'string' && (u.startsWith('http://') || u.startsWith('https://')))
        .map(u => u.trim())
    )
  );

  if (cleanUrls.length === 0) {
    return [{ success: true, count: 0, endpoint: endpointHost, message: 'No URLs to submit' }];
  }

  // Chunk URLs into groups of 500 (IndexNow API limit per request)
  const CHUNK_SIZE = 500;
  const chunks: string[][] = [];
  for (let i = 0; i < cleanUrls.length; i += CHUNK_SIZE) {
    chunks.push(cleanUrls.slice(i, i + CHUNK_SIZE));
  }

  const results: IndexNowResult[] = [];

  for (const chunk of chunks) {
    const payload = JSON.stringify({
      host: targetHost,
      key: key,
      keyLocation: keyLocation,
      urlList: chunk,
    });

    try {
      const res = await new Promise<IndexNowResult>((resolve) => {
        const req = https.request(
          {
            hostname: endpointHost,
            path: '/indexnow',
            method: 'POST',
            timeout: 7000,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Content-Length': Buffer.byteLength(payload),
              'User-Agent': 'DECK-divider-IndexNow-Pinger/1.0',
            },
          },
          (response) => {
            let responseBody = '';
            response.on('data', (c) => (responseBody += c));
            response.on('end', () => {
              const status = response.statusCode ?? 0;
              const isSuccess = status >= 200 && status < 300;

              if (isSuccess) {
                console.log(`[IndexNow (${endpointHost})] ✓ Successfully submitted ${chunk.length} URLs for ${targetHost} (status: ${status}).`);
                resolve({ success: true, status, count: chunk.length, endpoint: endpointHost });
              } else if (status === 403 || responseBody.includes('UserForbiddedToAccessSite')) {
                console.info(
                  `[IndexNow (${endpointHost})] Verification notice for ${targetHost}: Key verification file is hosted at ${keyLocation}.`
                );
                resolve({
                  success: false,
                  status: 403,
                  count: chunk.length,
                  endpoint: endpointHost,
                  message: `Key verification pending on https://${targetHost}/${key}.txt`,
                });
              } else if (status === 422) {
                console.warn(`[IndexNow (${endpointHost})] 422 Unprocessable Entity: URLs do not belong to host ${targetHost}.`);
                resolve({ success: false, status: 422, count: chunk.length, endpoint: endpointHost, message: 'URLs do not match host' });
              } else {
                console.info(`[IndexNow (${endpointHost})] Notice (${chunk.length} URLs, status: ${status}): ${responseBody.slice(0, 200)}`);
                resolve({ success: false, status, count: chunk.length, endpoint: endpointHost, message: responseBody });
              }
            });
          }
        );

        req.on('timeout', () => {
          req.destroy();
          resolve({ success: false, status: 408, count: chunk.length, endpoint: endpointHost, message: 'Request timed out' });
        });

        req.on('error', (e) => {
          console.info(`[IndexNow (${endpointHost})] Network notice: ${e.message}`);
          resolve({ success: false, status: 500, count: chunk.length, endpoint: endpointHost, message: e.message });
        });

        req.write(payload);
        req.end();
      });

      results.push(res);
    } catch (err: any) {
      console.info(`[IndexNow (${endpointHost})] Batch error:`, err?.message || err);
      results.push({ success: false, count: chunk.length, endpoint: endpointHost, message: err?.message });
    }
  }

  return results;
}

/**
 * Pings major search engine sitemap submission endpoints
 */
export async function pingSearchEngineSitemaps(sitemapUrl: string = 'https://deckdivider.app/sitemap-index.xml'): Promise<SearchEnginePingResult[]> {
  const encoded = encodeURIComponent(sitemapUrl);
  const targets = [
    { engine: 'Google', url: `https://www.google.com/ping?sitemap=${encoded}` },
    { engine: 'Bing', url: `https://www.bing.com/ping?sitemap=${encoded}` },
  ];

  const results: SearchEnginePingResult[] = [];

  for (const target of targets) {
    try {
      const res = await new Promise<SearchEnginePingResult>((resolve) => {
        const u = new URL(target.url);
        const req = https.get(
          {
            hostname: u.hostname,
            path: u.pathname + u.search,
            timeout: 5000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; DECKdividerSitemapPinger/1.0)',
            },
          },
          (response) => {
            const status = response.statusCode ?? 0;
            response.resume(); // consume response data to free memory
            resolve({
              engine: target.engine,
              url: target.url,
              status,
              success: status >= 200 && status < 400,
            });
          }
        );

        req.on('timeout', () => {
          req.destroy();
          resolve({ engine: target.engine, url: target.url, status: 408, success: false });
        });

        req.on('error', (e) => {
          resolve({ engine: target.engine, url: target.url, status: 500, success: false });
        });
      });

      results.push(res);
    } catch {
      results.push({ engine: target.engine, url: target.url, status: 500, success: false });
    }
  }

  return results;
}

/**
 * Comprehensive Full-Site Purge Broadcaster:
 * Ingests all core routes, meta decks, sets, markdown mirrors, and sitemaps,
 * and pushes them in parallel to IndexNow and Search Engine Pingers.
 */
export async function broadcastFullSitePurge(urls: string[], sitemapUrl: string = 'https://deckdivider.app/sitemap-index.xml'): Promise<FullPurgeBroadcastResult> {
  const cleanUrls = Array.from(new Set(urls.filter(u => Boolean(u && u.startsWith('http')))));

  // 1. Dispatch IndexNow to primary api.indexnow.org
  const indexNowResults = await pingIndexNow(cleanUrls, 'api.indexnow.org');

  // 2. Dispatch sitemap pings
  const sitemapPingResults = await pingSearchEngineSitemaps(sitemapUrl);

  return {
    timestamp: new Date().toISOString(),
    totalUrls: cleanUrls.length,
    indexNowResults,
    sitemapPingResults,
  };
}


