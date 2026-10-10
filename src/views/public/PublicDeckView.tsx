import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Share2,
  Copy,
  Check,
  Zap,
  Download,
  AlertTriangle,
  ChevronLeft,
  PieChart as PieIcon,
  Layers,
  Swords,
  Grid,
  Table,
  Code2,
  Image as ImageIcon,
} from 'lucide-react';
import { Deck, PortfolioCardEntry, PokemonCard } from '../../types';
import { decodeUrlParamToDeck, encodeDeckToUrlParam } from '../../utils/deckUrlEncoder';
import { getCardById, mapToPokemonCard } from '../../lib/searchEngine';
import { idbGetUserDecks } from '../../lib/indexedDB';
import { HolographicCard } from '../../components/ui/HolographicCard';
import { CardImage } from '../../components/ui/CardImage';
import { QuickLookModal } from '../../components/modals/QuickLookModal';
import { EmbedBadgeModal } from '../../components/modals/EmbedBadgeModal';
import { DeckDividerBrand } from '../../components/ui/DeckDividerBrand';
import { formatCurrency } from '../../utils/formatters';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { getPublicDeckSchema } from '../../components/seo/schemaData';
import { generateDeckSeoMetadata, updateDocumentMetaTags } from '../../utils/keywordDatabase';
import { getTournamentDeckBySlug } from '../../data/tournamentDecks';

interface PublicDeckViewProps {
  deckId?: string;
  encodedData?: string;
  onOpenFullApp: () => void;
  activeCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

/**
 * Helper function to dynamically update document <meta> tags (canonical, description, and keywords)
 * based on the specific deck currently being viewed, leveraging the keyword database.
 */
export function updateDeckDocumentMeta(deck: Deck | null, deckId?: string) {
  const seo = generateDeckSeoMetadata(deck, deckId);
  const deckName = deck?.name || 'Shared Pokémon TCG Deck';
  const count = deck?.entries?.reduce((acc, c) => acc + (c.quantity || 1), 0) || 60;
  const ogImg = deck
    ? `https://deckdivider.app/api/og/deck/${deck.id || deckId || 'deck'}.png?title=${encodeURIComponent(deckName)}&count=${count}`
    : 'https://deckdivider.app/og-image.png?v=2';

  updateDocumentMetaTags({
    title: seo.title,
    description: seo.description,
    canonicalPath: seo.canonicalPath,
    keywords: seo.keywords,
    ogImage: ogImg,
    jsonLd: deck ? {
      '@context': 'https://schema.org',
      '@type': 'ItemPage',
      name: deckName,
      description: `Pokémon TCG 60-card tournament deck roster for ${deckName}`,
      url: seo.canonical,
      mainEntity: {
        '@type': 'ItemList',
        name: `${deckName} Card Roster`,
        numberOfItems: count,
      },
    } : undefined
  });
  return seo;
}

export function getPtcglSetCode(setName?: string, cardId?: string): string {
  const norm = (setName || '').toLowerCase().trim();
  const cid = (cardId || '').toLowerCase().trim();

  if (norm.includes('basic energy') || (norm.includes('energy') && cid.startsWith('sv01-09'))) return 'SVE';

  if (cid.startsWith('sv08pt5') || cid.startsWith('sv8pt5')) return 'PRE';
  if (cid.startsWith('sv08') || cid.startsWith('sv8')) return 'SSP';
  if (cid.startsWith('sv07') || cid.startsWith('sv7')) return 'SCR';
  if (cid.startsWith('sv06pt5') || cid.startsWith('sv6pt5')) return 'SFA';
  if (cid.startsWith('sv06') || cid.startsWith('sv6')) return 'TWM';
  if (cid.startsWith('sv05') || cid.startsWith('sv5')) return 'TEF';
  if (cid.startsWith('sv04pt5') || cid.startsWith('sv4pt5')) return 'PAF';
  if (cid.startsWith('sv04') || cid.startsWith('sv4')) return 'PAR';
  if (cid.startsWith('sv03pt5') || cid.startsWith('sv3pt5')) return 'MEW';
  if (cid.startsWith('sv03') || cid.startsWith('sv3')) return 'OBF';
  if (cid.startsWith('sv02') || cid.startsWith('sv2')) return 'PAL';
  if (cid.startsWith('sv01') || cid.startsWith('sv1')) return 'SVI';
  if (cid.startsWith('swsh12pt5')) return 'CRZ';
  if (cid.startsWith('swsh12')) return 'SIT';
  if (cid.startsWith('swsh11')) return 'LOR';
  if (cid.startsWith('swsh10pt5')) return 'PGO';
  if (cid.startsWith('swsh10')) return 'ASR';
  if (cid.startsWith('swsh09') || cid.startsWith('swsh9')) return 'BRS';
  if (cid.startsWith('swsh08') || cid.startsWith('swsh8')) return 'FST';
  if (cid.startsWith('swsh07') || cid.startsWith('swsh7')) return 'EVS';
  if (cid.startsWith('swsh06') || cid.startsWith('swsh6')) return 'CRE';
  if (cid.startsWith('swsh05') || cid.startsWith('swsh5')) return 'BST';
  if (cid.startsWith('swsh04pt5') || cid.startsWith('swsh4pt5')) return 'SHF';
  if (cid.startsWith('swsh04') || cid.startsWith('swsh4')) return 'VIV';
  if (cid.startsWith('swsh03pt5') || cid.startsWith('swsh3pt5')) return 'CPA';
  if (cid.startsWith('swsh03') || cid.startsWith('swsh3')) return 'DAA';
  if (cid.startsWith('swsh02') || cid.startsWith('swsh2')) return 'RCL';
  if (cid.startsWith('swsh01') || cid.startsWith('swsh1')) return 'SSH';

  if (norm.includes('prismatic evolutions')) return 'PRE';
  if (norm.includes('surging sparks')) return 'SSP';
  if (norm.includes('stellar crown')) return 'SCR';
  if (norm.includes('shrouded fable')) return 'SFA';
  if (norm.includes('twilight masquerade')) return 'TWM';
  if (norm.includes('temporal forces')) return 'TEF';
  if (norm.includes('paldean fates')) return 'PAF';
  if (norm.includes('paradox rift')) return 'PAR';
  if (norm.includes('151')) return 'MEW';
  if (norm.includes('obsidian flames')) return 'OBF';
  if (norm.includes('paldea evolved')) return 'PAL';
  if (norm.includes('scarlet & violet') || norm.includes('scarlet and violet')) return 'SVI';
  if (norm.includes('crown zenith')) return 'CRZ';
  if (norm.includes('silver tempest')) return 'SIT';
  if (norm.includes('lost origin')) return 'LOR';
  if (norm.includes('pokémon go') || norm.includes('pokemon go')) return 'PGO';
  if (norm.includes('astral radiance')) return 'ASR';
  if (norm.includes('brilliant stars')) return 'BRS';
  if (norm.includes('fusion strike')) return 'FST';
  if (norm.includes('celebrations')) return 'CEL';
  if (norm.includes('evolving skies')) return 'EVS';
  if (norm.includes('chilling reign')) return 'CRE';
  if (norm.includes('battle styles')) return 'BST';
  if (norm.includes('shining fates')) return 'SHF';
  if (norm.includes('vivid voltage')) return 'VIV';
  if (norm.includes('darkness ablaze')) return 'DAA';
  if (norm.includes('rebel clash')) return 'RCL';
  if (norm.includes('sword & shield') || norm.includes('sword and shield')) return 'SSH';

  return 'SVI';
}

// Function to format deck as native PTCGL import text
function formatPTCGL(entries: PortfolioCardEntry[]): string {
  const pokemon: { qty: number; line: string }[] = [];
  const trainers: { qty: number; line: string }[] = [];
  const energy: { qty: number; line: string }[] = [];

  (entries || []).forEach(entry => {
    if (!entry || !entry.card) return;
    const sup = (entry.card.supertype || '').toLowerCase();
    const qty = entry.quantity || 1;
    const setCode = getPtcglSetCode(entry.card.set?.name, entry.card.id || entry.cardId);
    let cardName = entry.card.name || 'Card';
    const num = entry.card.number || '1';
    const line = `${qty} ${cardName} ${setCode} ${num}`.trim();

    if (sup.includes('pokémon') || sup.includes('pokemon')) {
      pokemon.push({ qty, line });
    } else if (sup.includes('energy')) {
      energy.push({ qty, line });
    } else {
      trainers.push({ qty, line });
    }
  });

  const pTotal = pokemon.reduce((acc, c) => acc + c.qty, 0);
  const tTotal = trainers.reduce((acc, c) => acc + c.qty, 0);
  const eTotal = energy.reduce((acc, c) => acc + c.qty, 0);

  const sections: string[] = [];
  if (pokemon.length > 0) {
    sections.push(`Pokémon: ${pTotal}\n${pokemon.map(p => p.line).join('\n')}`);
  }
  if (trainers.length > 0) {
    sections.push(`Trainer: ${tTotal}\n${trainers.map(t => t.line).join('\n')}`);
  }
  if (energy.length > 0) {
    sections.push(`Energy: ${eTotal}\n${energy.map(e => e.line).join('\n')}`);
  }

  return sections.join('\n\n');
}

export const PublicDeckView: React.FC<PublicDeckViewProps> = ({
  deckId,
  encodedData,
  onOpenFullApp,
  activeCurrency,
  onCurrencyChange
}) => {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'binder' | 'table'>('binder');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPtcgl, setCopiedPtcgl] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [quickLookCard, setQuickLookCard] = useState<PokemonCard | null>(null);
  
  // Hydrate card data with search engine
  const hydrateDeck = (partialDeck: Partial<Deck>) => {
    if (!partialDeck || !partialDeck.entries) return (partialDeck || {}) as Deck;
    
    const hydratedCards: PortfolioCardEntry[] = partialDeck.entries.map(entry => {
      const tcgdexId = entry?.card?.id || (entry as any)?.cardId;
      const fullCardData = tcgdexId ? getCardById(tcgdexId) : null;
      
      if (fullCardData) {
        return {
          ...entry,
          card: mapToPokemonCard(fullCardData)
        };
      }
      return entry;
    });
    
    return { ...partialDeck, entries: hydratedCards } as Deck;
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadDeck = async () => {
      setIsLoading(true);
      setError(null);
      
      let loadedDeck: Partial<Deck> | null = null;
      
      if (encodedData) {
        loadedDeck = decodeUrlParamToDeck(encodedData);
      } else if (deckId) {
        // 1. Check if deckId matches a standard tournament meta deck archetype
        const tournamentMatch = getTournamentDeckBySlug(deckId);
        if (tournamentMatch) {
          const entries: PortfolioCardEntry[] = tournamentMatch.entries.map((e, idx) => ({
            id: `entry-${idx}-${e.cardId}`,
            cardId: e.cardId,
            quantity: e.quantity,
            purchasePrice: e.price,
            purchaseCurrency: 'USD',
            purchaseDate: new Date().toISOString().split('T')[0],
            isSold: false,
            condition: 'NM',
            variant: 'Normal',
            card: {
              id: e.cardId,
              name: e.name,
              supertype: e.category === 'Pokemon' ? 'Pokémon' : e.category,
              subtypes: [],
              number: e.number,
              rarity: 'Common',
              artist: 'Official',
              set: {
                id: e.cardId.split('-')[0] || 'sv',
                name: e.setName,
                series: 'Scarlet & Violet',
                printedTotal: 100,
                total: 100,
                releaseDate: '2024-01-01',
              },
              images: {
                small: `https://images.pokemontcg.io/${e.cardId.split('-')[0]}/${e.cardId.split('-')[1]}.png`,
                large: `https://images.pokemontcg.io/${e.cardId.split('-')[0]}/${e.cardId.split('-')[1]}_hires.png`,
              },
              prices: {
                raw: e.price,
                psa10Estimate: e.price * 3,
                psa9Estimate: e.price * 1.5,
                priceHistory: [],
              },
              tcgplayer: {
                price: e.price,
              },
            } as any
          }));

          loadedDeck = {
            id: tournamentMatch.id,
            name: `${tournamentMatch.name} (${tournamentMatch.tier})`,
            description: tournamentMatch.description,
            colorHex: tournamentMatch.colorHex,
            isPublic: true,
            isStandardLegal: tournamentMatch.isStandardLegal,
            format: tournamentMatch.format,
            entries,
          } as any;
        } else {
          // 2. Fall back to local user decks
          try {
            const localDecks = await idbGetUserDecks();
            const match = localDecks.find(d => d.id === deckId);
            if (match) {
              loadedDeck = match;
            }
          } catch (e) {
            console.warn('Could not query local decks for deckId:', deckId, e);
          }
        }
      }
      
      if (!isMounted) return;
      
      if (loadedDeck) {
        // Hydrate and set immediately since App.tsx already initialized searchEngine
        setDeck(hydrateDeck(loadedDeck));
        setIsLoading(false);
      } else {
        setError('Deck not found or is not public.');
        setIsLoading(false);
      }
    };
    
    loadDeck();
    
    return () => {
      isMounted = false;
    };
  }, [deckId, encodedData]);

  const seoMetadata = useMemo(() => {
    return generateDeckSeoMetadata(deck, deckId);
  }, [deck, deckId]);

  useEffect(() => {
    if (deck) {
      updateDeckDocumentMeta(deck, deckId);
    }
  }, [deck, deckId]);

  // Statistics
  const totalCardsCount = useMemo(() => deck?.entries?.reduce((acc, c) => acc + (c.quantity || 1), 0) || 0, [deck]);
  
  const stats = useMemo(() => {
    if (!deck || !deck.entries) return { pokemon: 0, trainer: 0, energy: 0, totalValue: 0 };
    let pokemon = 0;
    let trainer = 0;
    let energy = 0;
    let totalValue = 0;
    
    deck.entries.forEach(entry => {
      if (!entry || !entry.card) return;
      const sup = (entry.card.supertype || '').toLowerCase();
      const qty = entry.quantity || 1;
      if (sup.includes('pokémon') || sup.includes('pokemon')) pokemon += qty;
      else if (sup.includes('energy')) energy += qty;
      else trainer += qty;
      
      const price = (entry.card.prices?.raw || 1.5) * qty;
      totalValue += price;
    });
    
    return { pokemon, trainer, energy, totalValue };
  }, [deck]);
  
  const isDeckStandardLegal = useMemo(() => {
    if (totalCardsCount !== 60) return false;
    if ((deck as any)?.isStandardLegal !== undefined) {
      return Boolean((deck as any).isStandardLegal);
    }
    const hasRotatedCards = deck?.entries?.some(e => {
      const set = (e.card?.set?.name || '').toLowerCase();
      const name = (e.card?.name || '').toLowerCase();
      if (name.includes('vstar') || name.includes('vmax') || (name.endsWith(' v') && !name.includes('iron') && !name.includes('great'))) return true;
      if (name.includes('radiant')) return true;
      if (set.includes('silver tempest') || set.includes('lost origin') || set.includes('astral radiance') || set.includes('brilliant stars') || set.includes('crown zenith')) return true;
      return false;
    });
    return !hasRotatedCards;
  }, [deck, totalCardsCount]);

  const handleCopyLink = async () => {
    try {
      const shareUrl = deck ? `${window.location.origin}/deck/${deck.id}?d=${encodeDeckToUrlParam(deck)}` : window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyPtcgl = async () => {
    if (!deck || !deck.entries) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(formatPTCGL(deck.entries));
      }
      setCopiedPtcgl(true);
      setTimeout(() => setCopiedPtcgl(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-slate-900 font-bold text-xl">Loading Deck...</h2>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto text-red-500 mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-slate-900 font-bold text-2xl">Deck Not Found</h2>
          <p className="text-slate-500">{error || 'This link may be invalid or the deck was made private.'}</p>
          <Link
            to="/"
            onClick={() => onOpenFullApp && onOpenFullApp()}
            className="w-full mt-6 py-3.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono font-bold rounded-xl transition-colors shadow-2xs inline-block text-center cursor-pointer"
          >
            Go to DECK / divider
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-y-auto">
      <PageHead
        title={seoMetadata.title}
        description={seoMetadata.description}
        canonicalPath={seoMetadata.canonicalPath}
        keywords={seoMetadata.keywords}
        ogImage="https://deckdivider.app/og-image.png?v=2"
        schema={
          deck
            ? getPublicDeckSchema(deck.name, totalCardsCount, stats.totalValue)
            : undefined
        }
      />
      {/* Top Banner (Header) */}
      <div className="bg-white sticky top-0 z-40 border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3" aria-label="DECK / divider Home">
              <DeckDividerBrand />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={activeCurrency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono font-bold text-[#0F172A] rounded-lg py-2 px-3 focus:ring-1 focus:ring-[#DC143C] outline-none cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 pb-24 space-y-6">
        <GeoBreadcrumbs
          items={[
            { label: 'Community Decks', path: '/community' },
            { label: deck?.name || 'Deck Roster', path: `/deck/${deck?.id || deckId || 'shared'}` },
          ]}
        />

        <GeoExtractableBlock
          heading={`Deck Overview: ${deck?.name || 'Competitive Pokémon Deck'}`}
          summary={`This Pokémon TCG deck contains ${totalCardsCount} cards (${stats.pokemon} Pokémon, ${stats.trainer} Trainers, and ${stats.energy} Energy cards) with an estimated live market value of ${formatCurrency(stats.totalValue, activeCurrency)}. It can be copied directly for import into Pokémon TCG Live (PTCGL) or cloned into your personal deck vault.`}
          keyFacts={[
            { label: 'Deck Name', value: deck?.name || 'Tournament Deck' },
            {
              label: 'Card Count',
              value: `${totalCardsCount} Cards ${
                (deck?.targetSize === 6 || (deck as any)?.targetSize === 6)
                  ? totalCardsCount === 6 ? '(Complete 6-Card Mini)' : `(Incomplete 6-Card: ${totalCardsCount}/6)`
                  : (deck?.targetSize && deck.targetSize !== 60 && deck.targetSize !== Infinity)
                  ? totalCardsCount === deck.targetSize ? `(Complete ${deck.targetSize}-Card)` : `(Incomplete: ${totalCardsCount}/${deck.targetSize})`
                  : isDeckStandardLegal
                  ? '(Standard Legal 60)'
                  : totalCardsCount === 60
                  ? '(Expanded 60)'
                  : `(Incomplete ${totalCardsCount}/60)`
              }`,
            },
            { label: 'Market Value', value: formatCurrency(stats.totalValue, activeCurrency) },
            { label: 'PTCGL Ready', value: 'Instant Text Export' },
          ]}
        />

        {/* PTC Collectibles Partner Offer */}
        <PtcPartnerBanner context="decks" />

        {/* Deck Header Info */}
        <div className="p-3 sm:p-4 md:p-5 glass-slab shadow-md space-y-5">
          {/* Header Row: Title & Function Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div
                className="w-4 h-4 rounded-full border border-black/10 shadow-xs flex-shrink-0 mt-1 sm:mt-1.5"
                style={{ backgroundColor: deck.colorHex || '#DC143C' }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-heading font-bold text-lg sm:text-xl text-[#0F172A] truncate">
                    {deck.name}
                  </h2>
                  {deck?.targetSize === 6 ? (
                    <>
                      <span className="font-mono text-[10px] sm:text-xs font-bold bg-[#7C3AED] text-white px-2 py-0.5 rounded flex-shrink-0 shadow-xs">
                        {totalCardsCount}/6 Cards (Mini)
                      </span>
                      {totalCardsCount === 6 ? (
                        <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 border bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/30">
                          Complete 6-Card Mini Deck
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 border bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/30">
                          Incomplete ({totalCardsCount}/6)
                        </span>
                      )}
                    </>
                  ) : deck?.targetSize && deck.targetSize !== 60 && deck.targetSize !== Infinity ? (
                    <>
                      <span className="font-mono text-[10px] sm:text-xs font-bold bg-[#0284C7] text-white px-2 py-0.5 rounded flex-shrink-0 shadow-xs">
                        {totalCardsCount}/{deck.targetSize} Cards
                      </span>
                      {totalCardsCount === deck.targetSize ? (
                        <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 border bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/30">
                          Complete {deck.targetSize}-Card Roster
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 border bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/30">
                          Incomplete ({totalCardsCount}/{deck.targetSize})
                        </span>
                      )}
                    </>
                  ) : deck?.targetSize === Infinity ? (
                    <>
                      <span className="font-mono text-[10px] sm:text-xs font-bold bg-[#0F172A] text-white px-2 py-0.5 rounded flex-shrink-0 shadow-xs">
                        {totalCardsCount} Cards (Unlimited ∞)
                      </span>
                      <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 border bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/30">
                        Custom Open Format
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-mono text-[10px] sm:text-xs font-bold bg-[#DC143C] text-white px-2 py-0.5 rounded flex-shrink-0 shadow-xs">
                        {totalCardsCount}/60 Cards
                      </span>
                      {totalCardsCount !== 60 ? (
                        <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 border bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/30">
                          Incomplete ({totalCardsCount}/60)
                        </span>
                      ) : isDeckStandardLegal ? (
                        <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 border bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/30">
                          Standard Legal
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 border bg-[#FFFBEB] text-[#D97706] border-[#D97706]/30">
                          Expanded Legal (Rotated)
                        </span>
                      )}
                    </>
                  )}
                </div>
                {deck.description && (
                  <p className="font-mono text-[11px] sm:text-xs text-[#64748B] mt-0.5 max-w-xl truncate">
                    {deck.description}
                  </p>
                )}
              </div>
            </div>

            {/* Function Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2 w-full lg:w-auto">
              <button
                type="button"
                onClick={handleCopyPtcgl}
                className="h-9 px-3 text-xs font-mono font-bold rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-[#0F172A] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {copiedPtcgl ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
                <span>{copiedPtcgl ? 'Exported' : 'PTCGL'}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="h-9 px-3 text-xs font-mono font-bold rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-[#0F172A] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Share2 className="w-3.5 h-3.5 text-[#64748B]" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowEmbedModal(true)}
                className="h-9 px-3 text-xs font-mono font-bold rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-[#0F172A] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Embed live badge on your website or forum"
              >
                <Code2 className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Embed</span>
              </button>
            </div>
          </div>

          {/* View Mode Switcher Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {[
                { id: 'binder', label: 'Binder View', icon: Grid },
                { id: 'table', label: 'Data Table', icon: Table },
              ].map((mode) => {
                const isActive = viewMode === mode.id;
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setViewMode(mode.id as any)}
                    className={`h-9 px-3 text-xs font-mono font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer w-full sm:w-auto text-center ${
                      isActive
                        ? 'bg-[#DC143C] text-white border-[#DC143C] shadow-xs'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#DC143C]' : 'text-[#64748B]'}`} />
                    <span className="truncate">{mode.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="font-mono text-xs text-[#0F172A] font-bold text-right sm:text-left flex-shrink-0 flex items-center gap-2 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
              <span className="text-[#64748B]">Est. Value:</span>
              {formatCurrency(stats.totalValue, activeCurrency as any)}
            </div>
          </div>
        </div>

        {/* Deck Contents */}
        {viewMode === 'binder' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span>Showing {deck.entries.length} unique cards in "{deck.name}"</span>
              <span>3D Holographic Canvas</span>
            </div>

            {deck.entries.length === 0 ? (
              <div className="text-center py-12 space-y-2 glass-slab shadow-md">
                <Layers className="w-8 h-8 text-[#CBD5E1] mx-auto" />
                <p className="font-heading font-bold text-sm text-[#0F172A]">
                  This deck has no active cards yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-5 rounded-xl bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/50 border border-[#E2E8F0]">
                {(deck.entries || []).map((entry, idx) => (
                  <div key={entry?.card?.id || entry?.id || `entry-${idx}`} className="relative group cursor-pointer">
                    {entry?.card && (
                      <HolographicCard
                        card={entry.card}
                        currency={activeCurrency as any}
                        quantity={entry.quantity || 1}
                        deckName={deck.name}
                        deckColor={deck.colorHex}
                        onClick={() => setQuickLookCard(entry.card)}
                        onQuickLook={() => setQuickLookCard(entry.card)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="overflow-x-auto glass-slab shadow-md">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
                <tr>
                  <th className="p-3">Card Name</th>
                  <th className="p-3">Set</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Unit Value</th>
                  <th className="p-3">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {(deck.entries || []).map((entry, idx) => {
                  const card = entry?.card;
                  if (!card) return null;
                  const price = card.prices?.raw || 1.5;
                  const qty = entry.quantity || 1;
                  return (
                    <tr key={card.id || `row-${idx}`} className="hover:bg-[#F8FAFC] transition-colors cursor-pointer" onClick={() => setQuickLookCard(card)}>
                      <td className="p-3 font-heading font-semibold text-[#0F172A]">
                        {card.name || 'Card'}
                      </td>
                      <td className="p-3 text-[#64748B]">{card.set?.name || 'Standard'}</td>
                      <td className="p-3 font-num font-bold">{qty}</td>
                      <td className="p-3 font-num">
                        {formatCurrency(price, activeCurrency as any)}
                      </td>
                      <td className="p-3 font-num font-bold text-[#DC143C]">
                        {formatCurrency((price * qty), activeCurrency as any)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {quickLookCard && (
        <QuickLookModal
          card={quickLookCard}
          cardList={(deck.entries || []).map(e => e?.card).filter((c): c is PokemonCard => Boolean(c))}
          onClose={() => setQuickLookCard(null)}
          onNavigateCard={setQuickLookCard}
          currency={activeCurrency as any}
        />
      )}

      {deck && (
        <EmbedBadgeModal
          isOpen={showEmbedModal}
          onClose={() => setShowEmbedModal(false)}
          options={{
            type: 'deck',
            idOrSlug: deck.id || deckId || 'deck',
            title: deck.name || 'Competitive Deck',
            subtitle: `${totalCardsCount} Cards • Standard Legal`,
            count: totalCardsCount,
            value: Math.round(stats.totalValue),
            currency: activeCurrency === 'EUR' ? '€' : activeCurrency === 'GBP' ? '£' : '$',
          }}
        />
      )}

      {/* Footer Disclaimer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="font-medium flex items-center gap-4">
            <span>© {new Date().getFullYear()} DECK / divider. All rights reserved.</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <Link to="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
            <span className="hidden md:inline text-slate-300">|</span>
            <Link to="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
          </div>
          <div className="text-center md:text-right text-[11px] leading-relaxed text-slate-400">
            DECK/divider is an independent fan project and is not affiliated with, endorsed by, or sponsored by The Pokémon Company, Nintendo, or Game Freak.
          </div>
        </div>
      </footer>
    </div>
  );
};
