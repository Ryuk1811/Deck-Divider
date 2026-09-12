/**
 * SEO helper for dynamic client-side routing and metadata updates.
 * Updates title, description, canonical link, Open Graph properties, and route-specific JSON-LD.
 */

export interface PageSeoOptions {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  keywords?: string[] | string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export function updatePageSeo(options: PageSeoOptions): void {
  if (typeof document === 'undefined') return;

  const { title, description, canonicalPath, ogImage, keywords, jsonLd } = options;

  // 1. Update Title
  if (title) {
    document.title = title.includes('DECK / divider') ? title : `${title} | DECK / divider`;
  }

  // 2. Update Description
  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', description);
  }

  // 2b. Update Keywords
  if (keywords) {
    const keywordsContent = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    let metaKw = document.querySelector('meta[name="keywords"]');
    if (!metaKw) {
      metaKw = document.createElement('meta');
      metaKw.setAttribute('name', 'keywords');
      document.head.appendChild(metaKw);
    }
    metaKw.setAttribute('content', keywordsContent);
  }

  // 3. Update Canonical URL
  const path = canonicalPath !== undefined 
    ? canonicalPath 
    : (typeof window !== 'undefined' ? window.location.pathname : '/');
  
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
  const canonicalUrl = `https://deckdivider.app${cleanPath}`;

  let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    linkCanonical.id = 'canonical-link';
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonicalUrl);

  // 4. Update OG URL and Title
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute('content', canonicalUrl);
  }

  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && title) {
    ogTitle.setAttribute('content', document.title);
  }

  if (ogImage) {
    let ogImgTag = document.querySelector('meta[property="og:image"]');
    if (ogImgTag) ogImgTag.setAttribute('content', ogImage);
  }

  // 5. Inject / Update Route-specific JSON-LD
  if (jsonLd) {
    let scriptTag = document.getElementById('route-specific-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.id = 'route-specific-jsonld';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLd);
  }
}
