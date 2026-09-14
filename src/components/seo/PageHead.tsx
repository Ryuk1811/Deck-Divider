import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface PageHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  keywords?: string[];
  schema?: Record<string, any> | Array<Record<string, any>>;
}

export const updatePageSeo = (config?: any) => {
  // Provided for programmatic or imperative compatibility; PageHead component manages tags declaratively
  if (!config) return;
  if (config.title) document.title = config.title;
};

const BASE_URL = 'https://deckdivider.app';

export const PageHead: React.FC<PageHeadProps> = ({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  ogImage = 'https://deckdivider.app/og-image.png?v=2',
  keywords,
  schema,
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to update or create meta tag
    const setMetaTag = (attribute: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta
    setMetaTag('name', 'description', description);
    if (keywords && keywords.length > 0) {
      setMetaTag('name', 'keywords', keywords.join(', '));
    }
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'thumbnail', ogImage);

    // 3. Canonical Link
    const fullCanonicalUrl = `${BASE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', fullCanonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'DECK / divider');

    // 5. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Schema Injection
    if (schema) {
      let scriptTag = document.getElementById('dd-page-schema') as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dd-page-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema, null, 2);
    }

    return () => {
      // Clean up dynamic schema on route change
      const scriptTag = document.getElementById('dd-page-schema');
      if (scriptTag) {
        scriptTag.textContent = '';
      }
    };
  }, [title, description, canonicalPath, ogType, ogImage, keywords, schema]);

  return null;
};

/**
 * GeoExtractableBlock: A 40-80 word direct answer definition snippet
 * optimized for Perplexity, ChatGPT Search, Gemini, and Google AI Overviews.
 */
export interface GeoExtractableBlockProps {
  heading: string;
  badge?: string;
  summary: string;
  keyFacts?: Array<{ label: string; value: string }>;
  verifiedDate?: string;
  className?: string;
}

export const GeoExtractableBlock: React.FC<GeoExtractableBlockProps> = () => {
  // Removed artificial "Verified Quick Answer" UI widget
  return null;
};

/**
 * GeoBreadcrumbs: Visual accessible breadcrumb trail that maps directly to Schema.org BreadcrumbList.
 */
export interface BreadcrumbItem {
  label: string;
  path: string;
}

export const GeoBreadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="w-full pb-4">
      <ol className="flex items-center flex-wrap gap-1 text-xs text-[#64748B]">
        <li>
          <Link to="/" className="hover:text-[#0F172A] transition-colors font-medium">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-slate-400" />
              {isLast ? (
                <span className="text-[#0F172A] font-semibold" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.path} className="hover:text-[#0F172A] transition-colors font-medium">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
