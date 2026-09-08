import https from 'https';

export async function pingIndexNow(urls: string[]): Promise<Array<{ success: boolean; status?: number; count: number }>> {
  const host = 'api.indexnow.org';
  const key = '7392abcd';
  const keyLocation = `https://deckdivider.app/${key}.txt`;

  // Chunk URLs into groups of 500
  const CHUNK_SIZE = 500;
  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    chunks.push(urls.slice(i, i + CHUNK_SIZE));
  }

  const results: Array<{ success: boolean; status?: number; count: number }> = [];

  for (const chunk of chunks) {
    const payload = JSON.stringify({
      host: 'deckdivider.app',
      key: key,
      keyLocation: keyLocation,
      urlList: chunk
    });

    try {
      const res = await new Promise<{ success: boolean; status?: number; count: number }>((resolve) => {
        const req = https.request(
          {
            hostname: host,
            path: '/indexnow',
            method: 'POST',
            timeout: 5000,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Content-Length': Buffer.byteLength(payload)
            }
          },
          (response) => {
            let responseBody = '';
            response.on('data', c => responseBody += c);
            response.on('end', () => {
              const ok = response.statusCode !== undefined && response.statusCode >= 200 && response.statusCode < 300;
              if (ok) {
                console.log(`[IndexNow] ✓ Successfully pushed batch of ${chunk.length} URLs (status: ${response.statusCode}).`);
              } else {
                console.warn(`[IndexNow] Batch notice (${chunk.length} URLs, status: ${response.statusCode}):`, responseBody);
              }
              resolve({ success: ok, status: response.statusCode, count: chunk.length });
            });
          }
        );

        req.on('timeout', () => {
          req.destroy();
          resolve({ success: false, status: 408, count: chunk.length });
        });

        req.on('error', (e) => {
          console.warn('[IndexNow] Batch network error (safe to ignore if offline):', e.message);
          resolve({ success: false, status: 500, count: chunk.length });
        });

        req.write(payload);
        req.end();
      });

      results.push(res);
    } catch (err) {
      console.warn('[IndexNow] Batch error:', err);
      results.push({ success: false, count: chunk.length });
    }
  }

  return results;
}

