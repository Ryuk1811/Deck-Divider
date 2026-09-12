import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Build multi-resolution standard Windows/Web ICO format buffer
function createIcoBuffer(pngBuffers: { width: number; height: number; buffer: Buffer }[]): Buffer {
  const count = pngBuffers.length;
  // Header: 6 bytes (2 reserved, 2 type = 1, 2 count)
  // Directory entries: 16 bytes each
  let headerSize = 6 + count * 16;
  let currentOffset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // icon type (1 = ICO)
  header.writeUInt16LE(count, 4); // count of images

  const dirEntries: Buffer[] = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // color palette (0 = no palette)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size of image in bytes
    entry.writeUInt32LE(currentOffset, 12); // file offset of image data
    dirEntries.push(entry);
    currentOffset += item.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)]);
}

async function regenerateAllIcons() {
  const logoPath = path.resolve(process.cwd(), 'public/logo.png');
  if (!fs.existsSync(logoPath)) {
    throw new Error('Canonical public/logo.png not found');
  }

  console.log('[IconGenerator] Loading master high-res logo from:', logoPath);

  // Target sizes for crisp rendering across all engines (ChatGPT, Grok, Apple, Google, Chrome)
  const targets = [
    { name: 'favicon-16x16.png', size: 16, paddingRatio: 0.05 },
    { name: 'favicon-32x32.png', size: 32, paddingRatio: 0.05 },
    { name: 'favicon-48x48.png', size: 48, paddingRatio: 0.05 },
    { name: 'favicon.png', size: 32, paddingRatio: 0.05 },
    { name: 'apple-touch-icon.png', size: 180, paddingRatio: 0.08 },
    { name: 'icon-192.png', size: 192, paddingRatio: 0.08 },
    { name: 'icon-google-192.png', size: 192, paddingRatio: 0.12 }, // extra padding for Google SERP circular mask
    { name: 'icon-512.png', size: 512, paddingRatio: 0.08 }
  ];

  const publicDir = path.resolve(process.cwd(), 'public');
  const distDir = path.resolve(process.cwd(), 'dist');

  const icoFrames: { width: number; height: number; buffer: Buffer }[] = [];

  for (const target of targets) {
    const innerSize = Math.round(target.size * (1 - target.paddingRatio * 2));
    const pad = Math.round((target.size - innerSize) / 2);

    const resizedLogo = await sharp(logoPath)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    const outputBuffer = await sharp({
      create: {
        width: target.size,
        height: target.size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: resizedLogo, top: pad, left: pad }])
      .png()
      .toBuffer();

    // Write to public/
    fs.writeFileSync(path.join(publicDir, target.name), outputBuffer);
    // Write to dist/ if dist exists
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, target.name), outputBuffer);
    }

    console.log(`[IconGenerator] ✓ Generated ${target.name} (${target.size}x${target.size})`);

    // Collect 16, 32, 48 for multi-size ICO
    if (target.size === 16 || target.size === 32 || target.size === 48) {
      icoFrames.push({ width: target.size, height: target.size, buffer: outputBuffer });
    }
  }

  // Generate multi-resolution favicon.ico
  const icoBuffer = createIcoBuffer(icoFrames);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.resolve(process.cwd(), 'favicon.ico'), icoBuffer);
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'favicon.ico'), icoBuffer);
  }
  console.log('[IconGenerator] ✓ Generated clean multi-resolution favicon.ico');

  // Verify that root logo.png matches public/logo.png
  fs.copyFileSync(logoPath, path.resolve(process.cwd(), 'logo.png'));
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(logoPath, path.join(distDir, 'logo.png'));
  }
  console.log('[IconGenerator] ✓ Synced root and dist logo.png');
}

regenerateAllIcons().catch((err) => {
  console.error('[IconGenerator] Error regenerating icons:', err);
  process.exit(1);
});
