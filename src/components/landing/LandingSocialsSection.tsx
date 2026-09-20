import React from 'react';
import { ExternalLink } from 'lucide-react';

export const LandingSocialsSection: React.FC = () => {
  return (
    <section id="socials-badges" className="w-full bg-white/80 backdrop-blur-xs border-t border-[#E2E8F0] py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
        
        {/* Reddit Visual Badge */}
        <a
          href="https://www.reddit.com/r/DeckDivider/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#FFF2ED] hover:bg-[#FFE5DC] border border-[#FFD9CC] transition-all shadow-2xs hover:shadow-xs hover:scale-[1.02]"
          aria-label="Reddit r/DeckDivider"
        >
          <div className="w-7 h-7 rounded-xl bg-[#FF4500] text-white flex items-center justify-center shadow-2xs">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.248a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.56 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
            </svg>
          </div>
          <span className="font-mono text-xs font-bold text-[#FF4500]">r/DeckDivider</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#FF4500] opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Instagram Visual Badge */}
        <a
          href="https://www.instagram.com/deckdivider/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFF0F5] to-[#FFF7ED] hover:from-[#FFE4EE] hover:to-[#FFEDD5] border border-[#FBCFE8] transition-all shadow-2xs hover:shadow-xs hover:scale-[1.02]"
          aria-label="Instagram @deckdivider"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white flex items-center justify-center shadow-2xs">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
          <span className="font-mono text-xs font-bold text-[#E1306C]">@deckdivider</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#E1306C] opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* X (Twitter) Visual Badge */}
        <a
          href="https://x.com/DeckDivider"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] transition-all shadow-2xs hover:shadow-xs hover:scale-[1.02]"
          aria-label="X @DeckDivider"
        >
          <div className="w-7 h-7 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shadow-2xs">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <span className="font-mono text-xs font-bold text-[#0F172A]">@DeckDivider</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#0F172A] opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Custom Badge 1: Neeed Directory */}
        <div className="inline-flex items-center hover:scale-[1.02] transition-transform">
          <a href="https://neeed.directory" target="_blank" rel="noopener" className="inline-block">
            <img 
              src="https://neeed.directory/badges/neeed-badge-light.svg" 
              alt="Featured on neeed.directory" 
              width="139"
              height="38"
              className="h-[42px] w-auto object-contain drop-shadow-2xs"
            />
          </a>
        </div>

        {/* Custom Badge 2: Product Hunt */}
        <div className="inline-flex items-center hover:scale-[1.02] transition-transform">
          <a 
            href="https://www.producthunt.com/products/deck-divider?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-deck-divider-2" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img 
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1249380&amp;theme=light&amp;t=1789911020614" 
              alt="Deck Divider - Track your Pokémon cards, slabs, and decks in one place | Product Hunt" 
              width="250" 
              height="54" 
              className="h-[42px] w-auto object-contain"
            />
          </a>
        </div>

      </div>
    </section>
  );
};
