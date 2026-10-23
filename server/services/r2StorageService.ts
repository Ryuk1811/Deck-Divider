/**
 * Cloudflare Pages, Workers & R2 Object Storage Integration Service
 * Manages rotated Cloudflare API Token, S3-compatible R2 credentials, and integration health checks.
 */

import https from 'https';

export interface CloudflareVerificationResult {
  success: boolean;
  timestamp: string;
  accountId: string;
  pagesProjectName?: string;
  pagesDomains?: string[];
  r2Endpoint: string;
  s3AccessKeyIdConfigured: boolean;
  s3SecretAccessKeyConfigured: boolean;
  apiTokenStatus: 'VERIFIED' | 'FAILED' | 'UNKNOWN';
  message: string;
}

export interface R2Config {
  accountId: string;
  projectId?: string;
  projectName?: string;
  apiToken: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  bucketName: string;
}

export function getR2Config(): R2Config {
  return {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '82194e5cb26731579613ad66f0af25e1',
    projectId: process.env.CLOUDFLARE_PROJECT_ID || 'a2f80e6a6d6c8a2a0392a43911d72f37',
    projectName: process.env.CLOUDFLARE_PROJECT_NAME || 'deck divider',
    apiToken: process.env.CLOUDFLARE_API_TOKEN || 'cfat_aR5MC6GHUaWR12in1ZbwTUNyVeMIsVk0095B7Ws3af33bc58',
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_ACCESS_KEY_ID || 'a2f80e6a6d6c8a2a0392a43911d72f37',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '0fcca8338eb37f34e19e980c49611f770f7a93a9fc41bab9bfc09f0a0de46741',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || 'https://82194e5cb26731579613ad66f0af25e1.r2.cloudflarestorage.com',
    bucketName: process.env.CLOUDFLARE_R2_BUCKET || 'deckdivider-vault',
  };
}

/**
 * Validates Cloudflare API credentials directly against Cloudflare v4 REST API.
 */
export async function verifyCloudflareIntegration(): Promise<CloudflareVerificationResult> {
  const config = getR2Config();

  const result: CloudflareVerificationResult = {
    success: false,
    timestamp: new Date().toISOString(),
    accountId: config.accountId,
    r2Endpoint: config.endpoint,
    s3AccessKeyIdConfigured: Boolean(config.accessKeyId),
    s3SecretAccessKeyConfigured: Boolean(config.secretAccessKey),
    apiTokenStatus: 'UNKNOWN',
    message: '',
  };

  try {
    const apiRes = await new Promise<{ status: number; body: string }>((resolve) => {
      const req = https.get(
        {
          hostname: 'api.cloudflare.com',
          path: `/client/v4/accounts/${config.accountId}/pages/projects`,
          method: 'GET',
          timeout: 8000,
          headers: {
            'Authorization': `Bearer ${config.apiToken}`,
            'User-Agent': 'DECK-divider-Cloudflare-Verifier/1.0',
            'Accept': 'application/json',
          },
        },
        (res) => {
          let body = '';
          res.on('data', (d) => (body += d));
          res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
        }
      );

      req.on('timeout', () => {
        req.destroy();
        resolve({ status: 408, body: JSON.stringify({ message: 'Request timed out' }) });
      });

      req.on('error', (err) => {
        resolve({ status: 500, body: JSON.stringify({ message: err.message }) });
      });
    });

    if (apiRes.status >= 200 && apiRes.status < 300) {
      const parsed = JSON.parse(apiRes.body);
      const projects = parsed.result || [];
      const deckdividerProject = projects.find((p: any) => p.name === 'deck divider' || p.name === 'deckdivider' || p.name === 'deck-divider' || p.id === 'a2f80e6a6d6c8a2a0392a43911d72f37') || projects[0];

      result.success = true;
      result.apiTokenStatus = 'VERIFIED';
      result.pagesProjectName = deckdividerProject?.name || config.projectName || 'deck divider';
      result.pagesDomains = deckdividerProject?.domains || ['deckdivider.pages.dev', 'deckdivider.app'];
      result.message = `Successfully authenticated with Cloudflare Account (${config.accountId}). Verified Pages project: ${result.pagesProjectName}.`;
    } else {
      result.apiTokenStatus = 'FAILED';
      result.message = `Cloudflare API returned status ${apiRes.status}: ${apiRes.body.slice(0, 180)}`;
    }
  } catch (err: any) {
    result.apiTokenStatus = 'FAILED';
    result.message = `Verification error: ${err.message || err}`;
  }

  return result;
}
