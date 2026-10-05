import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export const LandingSocialsSection: React.FC = () => {
  return (
    <section id="featured-badges" className="sr-only opacity-0 pointer-events-none absolute -left-[9999px] -top-[9999px] w-0 h-0 overflow-hidden" aria-hidden="true">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        
        {/* Section Header & Subtitle */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left border-b border-[#E2E8F0]/70 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]"></span>
            <span>Featured In &amp; Verified Directory Badges</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <Link
              to="/socials"
              className="text-[#DC143C] hover:underline font-bold flex items-center gap-1 transition-colors"
            >
              <span>Community &amp; Socials</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Symmetric 2x4 Grid Form (Raw Badges Grouped by Proportion) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-center justify-items-center w-full max-w-5xl mx-auto py-2">
          {/* Row 1: Featured Launch & Club Badges */}
          {/* 1. Product Hunt */}
          <a
            href="https://www.producthunt.com/products/deck-divider?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-deck-divider-2"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center p-1 hover:opacity-85 hover:scale-105 transition-all duration-200 cursor-pointer"
            title="DECK / divider - Featured on Product Hunt | Pokémon TCG Deck Builder & Collection Tracker"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1249380&theme=light&t=1789911020614"
              alt="DECK / divider - Featured on Product Hunt | Pokémon TCG Deck Builder & Tracker"
              loading="lazy"
              decoding="async"
              width="250"
              height="54"
              className="h-9 sm:h-10 lg:h-11 w-auto max-w-full object-contain pointer-events-none"
            />
          </a>

          {/* 2. Smol Launch */}
          <a
            href="https://smollaunch.com"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center p-1 hover:opacity-85 hover:scale-105 transition-all duration-200 cursor-pointer"
            title="DECK / divider Featured on Smol Launch"
          >
            <img
              src="https://smollaunch.com/badges/featured.svg"
              alt="DECK / divider Featured Product on Smol Launch"
              loading="lazy"
              decoding="async"
              width="250"
              height="60"
              className="h-9 sm:h-10 lg:h-11 w-auto max-w-full object-contain pointer-events-none"
            />
          </a>

          {/* 3. Super Launch */}
          <a
            href="https://super-launch.app"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center p-1 hover:opacity-85 hover:scale-105 transition-all duration-200 cursor-pointer"
            title="DECK / divider on Super Launch"
          >
            <img
              src="https://super-launch.app/badge/badge_transparent.svg"
              alt="DECK / divider on Super Launch — Top Pokémon TCG App"
              loading="lazy"
              decoding="async"
              width="200"
              height="54"
              className="h-9 sm:h-10 lg:h-11 w-auto max-w-full object-contain pointer-events-none"
            />
          </a>

          {/* 4. OpenHunts Club */}
          <a
            href="https://openhunts.com"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center p-1 hover:opacity-85 hover:scale-105 transition-all duration-200 cursor-pointer"
            title="OpenHunts Club"
          >
            <img
              src="https://cdn.openhunts.com/badges/club.webp"
              alt="OpenHunts Club Member"
              loading="lazy"
              decoding="async"
              width="486"
              height="105"
              className="h-9 sm:h-10 lg:h-11 w-auto max-w-full object-contain pointer-events-none"
            />
          </a>

          {/* Row 2: Verified Tool & Directory Badges */}
          {/* 5. Neeed Directory */}
          <a
            href="https://neeed.directory"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center p-1 hover:opacity-85 hover:scale-105 transition-all duration-200 cursor-pointer"
            title="DECK / divider Featured on Neeed.directory Web Tools"
          >
            <img
              src="https://neeed.directory/badges/neeed-badge-light.svg"
              alt="DECK / divider on neeed.directory — Verified Pokémon TCG Software"
              loading="lazy"
              decoding="async"
              width="139"
              height="32"
              className="h-9 sm:h-10 lg:h-11 w-auto max-w-full object-contain pointer-events-none"
            />
          </a>

          {/* 6. Findly.tools */}
          <a
            href="https://findly.tools/deck-divider?utm_source=deck-divider"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center p-1 hover:opacity-85 hover:scale-105 transition-all duration-200 cursor-pointer"
            title="DECK / divider on Findly.tools AI & SaaS Directory"
          >
            <img
              src="https://findly.tools/badges/findly-tools-badge-light.svg"
              alt="DECK / divider on Findly.tools — Verified TCG Deck Studio"
              loading="lazy"
              decoding="async"
              width="175"
              height="55"
              className="h-9 sm:h-10 lg:h-11 w-auto max-w-full object-contain pointer-events-none"
            />
          </a>

          {/* 7. NxGn Tools */}
          <a
            href="https://www.nxgntools.com/tools/deck-divider?utm_source=deck-divider"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center p-1 hover:opacity-85 hover:scale-105 transition-all duration-200 cursor-pointer"
            title="Find DECK / divider on NxGn Tools"
          >
            <img
              src="https://www.nxgntools.com/api/embed/deck-divider?type=FIND_US_ON"
              alt="Find DECK / divider on NxGn Tools Next-Gen Directory"
              loading="lazy"
              decoding="async"
              width="160"
              height="32"
              className="h-9 sm:h-10 lg:h-11 w-auto max-w-full object-contain pointer-events-none"
            />
          </a>

          {/* 8. FoundrList */}
          <a
            href="https://www.foundrlist.com/product/deckdivider?utm_source=badge&utm_medium=embed"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center p-1 hover:opacity-85 hover:scale-105 transition-all duration-200 cursor-pointer"
            title="DECK / divider Featured on FoundrList"
          >
            <img
              src="https://www.foundrlist.com/api/badge/deckdivider"
              alt="Featured on FoundrList"
              loading="lazy"
              decoding="async"
              width="150"
              height="48"
              className="h-9 sm:h-10 lg:h-11 w-auto max-w-full object-contain pointer-events-none"
            />
          </a>
        </div>

      </div>
    </section>
  );
};
