import https from 'https';

export async function pingIndexNow(urls: string[]) {
  const host = 'api.indexnow.org';
  const key = '7392abcd'; // Using valid 8 character key
  const keyLocation = `https://deckdivider.app/${key}.txt`;

  const payload = JSON.stringify({
    host: 'deckdivider.app',
    key: key,
    keyLocation: keyLocation,
    urlList: urls
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: host,
        path: '/indexnow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let responseBody = '';
        res.on('data', chunk => responseBody += chunk);
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`[IndexNow] Successfully pushed ${urls.length} URLs for indexing.`);
            resolve({ success: true, status: res.statusCode });
          } else {
            console.warn(`[IndexNow] Push failed with status ${res.statusCode}:`, responseBody);
            resolve({ success: false, status: res.statusCode, error: responseBody });
          }
        });
      }
    );

    req.on('error', (e) => {
      console.error('[IndexNow] Request error:', e);
      reject(e);
    });

    req.write(payload);
    req.end();
  });
}
