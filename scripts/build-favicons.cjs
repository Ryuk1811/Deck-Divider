const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function generateFavicons() {
  const publicDir = path.resolve(__dirname, '..', 'public');
  const distDir = path.resolve(__dirname, '..', 'dist');

  console.log('[Favicon] Launching browser to render pixel-perfect icons...');
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const renderIcon = async (size, fontSize, strokeWidth, borderRadius, letterSpacing) => {
    const page = await browser.newPage();
    const boxSize = Math.round(size * 0.92);
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=JetBrains+Mono:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: ${size}px;
          height: ${size}px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .icon-box {
          width: ${boxSize}px;
          height: ${boxSize}px;
          background: #090D16;
          border: ${strokeWidth}px solid #222736;
          border-radius: ${borderRadius}px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-text {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 800;
          line-height: 1;
          font-size: ${fontSize}px;
          letter-spacing: ${letterSpacing}px;
        }
        .letter-D {
          color: #DC143C;
          text-transform: uppercase;
        }
        .slash {
          color: #DC143C;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          margin: 0 ${Math.max(1, Math.round(size * 0.015))}px;
        }
        .letter-d {
          color: #FFFFFF;
          font-weight: 700;
        }
      </style>
    </head>
    <body>
      <div class="icon-box">
        <div class="brand-text">
          <span class="letter-D">D</span>
          <span class="slash">/</span>
          <span class="letter-d">d</span>
        </div>
      </div>
    </body>
    </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    const buffer = await page.screenshot({ omitBackground: true });
    await page.close();
    return buffer;
  };

  const p16 = await renderIcon(16, 7.5, 1, 3.5, -0.5);
  const p32 = await renderIcon(32, 14, 1.5, 7, -0.8);
  const p48 = await renderIcon(48, 21, 2, 10, -1);
  const p180 = await renderIcon(180, 78, 5, 40, -2);
  const p192 = await renderIcon(192, 84, 5, 42, -2.5);
  const p512 = await renderIcon(512, 220, 14, 110, -6);

  await browser.close();

  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), p16);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), p32);
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), p48);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), p32);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), p180);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), p192);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), p512);

  console.log('[Favicon] Bundling genuine multi-resolution Windows ICO resource...');
  execSync(`convert "${path.join(publicDir, 'favicon-16x16.png')}" "${path.join(publicDir, 'favicon-32x32.png')}" "${path.join(publicDir, 'favicon-48x48.png')}" "${path.join(publicDir, 'favicon.ico')}"`);

  if (fs.existsSync(distDir)) {
    console.log('[Favicon] Syncing generated icons to dist/ directory...');
    const filesToSync = [
      'favicon-16x16.png',
      'favicon-32x32.png',
      'favicon-48x48.png',
      'favicon.png',
      'favicon.ico',
      'apple-touch-icon.png',
      'icon-192.png',
      'icon-512.png'
    ];
    for (const f of filesToSync) {
      fs.copyFileSync(path.join(publicDir, f), path.join(distDir, f));
    }
  }

  console.log('[Favicon] All favicon assets generated and verified successfully.');
}

generateFavicons().catch(err => {
  console.error('[Favicon Error]', err);
  process.exit(1);
});
