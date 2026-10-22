import https from 'https';

export interface IndexNowResult {
  success: boolean;
  status?: number;
  count: number;
  message?: string;
}

export async function pingIndexNow(urls: string[]): Promise<IndexNowResult[]> {
  // Allow disabling IndexNow in local/dev environments via INDEXNOW_ENABLED=false
  if (process.env.INDEXNOW_ENABLED === 'false') {
    return [{ success: true, count: urls.length, message: 'IndexNow disabled via INDEXNOW_ENABLED=false' }];
  }

  const endpointHost = 'api.indexnow.org';
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
    return [{ success: true, count: 0, message: 'No URLs to submit' }];
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
            timeout: 6000,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Content-Length': Buffer.byteLength(payload),
            },
          },
          (response) => {
            let responseBody = '';
            response.on('data', (c) => (responseBody += c));
            response.on('end', () => {
              const status = response.statusCode ?? 0;
              const isSuccess = status >= 200 && status < 300;

              if (isSuccess) {
                console.log(`[IndexNow] ✓ Successfully submitted ${chunk.length} URLs for ${targetHost} (status: ${status}).`);
                resolve({ success: true, status, count: chunk.length });
              } else if (status === 403 || responseBody.includes('UserForbiddedToAccessSite')) {
                // Informational notice: Domain verification is pending until the production domain is live with the key file
                console.info(
                  `[IndexNow] Verification notice for ${targetHost}: Key verification file is hosted at ${keyLocation}. Once DNS and domain are live in production, automated indexing will activate.`
                );
                resolve({
                  success: false,
                  status: 403,
                  count: chunk.length,
                  message: `Key verification pending on https://${targetHost}/${key}.txt`,
                });
              } else if (status === 422) {
                console.warn(`[IndexNow] 422 Unprocessable Entity: URLs do not belong to host ${targetHost}.`);
                resolve({ success: false, status: 422, count: chunk.length, message: 'URLs do not match host' });
              } else {
                console.info(`[IndexNow] Notice (${chunk.length} URLs, status: ${status}): ${responseBody.slice(0, 200)}`);
                resolve({ success: false, status, count: chunk.length, message: responseBody });
              }
            });
          }
        );

        req.on('timeout', () => {
          req.destroy();
          resolve({ success: false, status: 408, count: chunk.length, message: 'Request timed out' });
        });

        req.on('error', (e) => {
          console.info('[IndexNow] Network offline or unreachable (safe to ignore in development):', e.message);
          resolve({ success: false, status: 500, count: chunk.length, message: e.message });
        });

        req.write(payload);
        req.end();
      });

      results.push(res);
    } catch (err: any) {
      console.info('[IndexNow] Batch notice:', err?.message || err);
      results.push({ success: false, count: chunk.length, message: err?.message });
    }
  }

  return results;
}


