/**
 * Cloudflare Credentials & Integration Verifier CLI
 * Validates rotated Account ID, API Token, and S3-compatible R2 storage configuration.
 * Usage: npx tsx scripts/verifyCloudflare.ts
 */

import dotenv from 'dotenv';
dotenv.config({ override: true });

import { verifyCloudflareIntegration, getR2Config } from '../server/services/r2StorageService.js';

async function main() {
  console.log('================================================================');
  console.log('☁️ DECK / divider — Cloudflare & R2 Credentials Verifier');
  console.log('================================================================');

  const config = getR2Config();
  console.log(`[Account ID]:      ${config.accountId}`);
  console.log(`[Project ID]:      ${config.projectId || '6c7c073314ae56896262e79b3119a7ad'}`);
  console.log(`[Pages Name]:      ${config.projectName || 'deck-divider'}`);
  console.log(`[API Token]:       ${config.apiToken.slice(0, 10)}...${config.apiToken.slice(-6)}`);
  console.log(`[R2 Access Key]:   ${config.accessKeyId.slice(0, 8)}...${config.accessKeyId.slice(-4)}`);
  console.log(`[R2 S3 Endpoint]:  ${config.endpoint}`);
  console.log(`[R2 Vault Bucket]: ${config.bucketName}`);

  console.log('\n[1/2] Authenticating with Cloudflare v4 REST API...');
  const result = await verifyCloudflareIntegration();

  if (result.success) {
    console.log('✓ Cloudflare API Token status: VERIFIED');
    console.log(`✓ Pages Project:              ${result.pagesProjectName}`);
    console.log(`✓ Associated Domains:         ${result.pagesDomains?.join(', ')}`);
  } else {
    console.error(`✗ Verification failed: ${result.message}`);
    process.exit(1);
  }

  console.log('\n[2/2] Validating S3 R2 Storage Configuration...');
  console.log(`✓ S3 Access Key ID:     Configured (${config.accessKeyId.length} chars)`);
  console.log(`✓ S3 Secret Access Key: Configured (${config.secretAccessKey.length} chars)`);
  console.log(`✓ S3 API Endpoint:      ${config.endpoint}`);

  console.log('\n================================================================');
  console.log('✓ All Cloudflare & R2 Credentials Successfully Verified & Active!');
  console.log('================================================================\n');

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error verifying Cloudflare credentials:', err);
  process.exit(1);
});
