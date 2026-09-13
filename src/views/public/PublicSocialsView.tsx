import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Star,
  MessageSquare,
  Twitter,
  Youtube,
  Github,
  Share2,
  Instagram,
  CheckCircle2,
  Sparkles,
  Shield,
  ThumbsUp,
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  Users,
  Award,
  Send,
  UserCheck,
  UserX,
  Heart,
  MessageCircle,
  HelpCircle,
  TrendingUp,
  Check,
  Clock,
  Copy
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { CommunityReview, ReviewCategory } from '../../types';
import { OFFICIAL_SOCIAL_CHANNELS, SOCIAL_FAQS } from '../../data/socialsData';
import { getSocialsPageSchema } from '../../components/seo/schemaData';
import { 
  getCommunityReviews, 
  subscribeToReviews, 
  submitReview, 
  isReviewLiked, 
  toggleLikeReview, 
  calculateReviewStats 
} from '../../lib/reviewsService';

const REVIEW_CATEGORIES: ReviewCategory[] = [
  'General & UI',
  'Master Set Checklist',
  'Deck Builder & PTCGL',
  'Graded Slabs & Pricing',
  'Sealed Vault',
  'Feature Request'
];

export const PublicSocialsView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSection = searchParams.get('section'); // 'socials' or 'reviews'

  // Reviews state
  const [reviews, setReviews] = useState<CommunityReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'likes'>('newest');

  // Form State
  const [showFormModal, setShowFormModal] = useState(false);
  const [formRating, setFormRating] = useState<number>(5);
  const [formHoverRating, setFormHoverRating] = useState<number>(0);
  const [formIsAnonymous, setFormIsAnonymous] = useState<boolean>(false);
  const [formAuthorName, setFormAuthorName] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formComment, setFormComment] = useState<string>('');
  const [formCategory, setFormCategory] = useState<ReviewCategory>('General & UI');
  const [formUserRole, setFormUserRole] = useState<string>('Trainer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [likedReviewsMap, setLikedReviewsMap] = useState<Record<string, boolean>>({});
  const [copiedChannelId, setCopiedChannelId] = useState<string | null>(null);

  // Subscribe to live reviews
  useEffect(() => {
    setLoadingReviews(true);
    const unsubscribe = subscribeToReviews((fetchedReviews) => {
      setReviews(fetchedReviews);
      setLoadingReviews(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync liked reviews state
  useEffect(() => {
    const map: Record<string, boolean> = {};
    reviews.forEach(r => {
      map[r.id] = isReviewLiked(r.id);
    });
    setLikedReviewsMap(map);
  }, [reviews]);

  // Scroll to section if specified in URL query
  useEffect(() => {
    if (initialSection) {
      const el = document.getElementById(initialSection);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialSection]);

  const stats = useMemo(() => calculateReviewStats(reviews), [reviews]);

  // Filter & sort reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter(r => {
        if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
        if (selectedRatingFilter !== 'all' && Math.round(r.rating) !== selectedRatingFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'likes') {
          return (b.likesCount || 0) - (a.likesCount || 0);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [reviews, selectedCategory, selectedRatingFilter, sortBy]);

  const handleLike = (reviewId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowLiked = toggleLikeReview(reviewId);
    setLikedReviewsMap(prev => ({ ...prev, [reviewId]: isNowLiked }));
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const currentCount = r.likesCount || 0;
        return {
          ...r,
          likesCount: isNowLiked ? currentCount + 1 : Math.max(0, currentCount - 1)
        };
      }
      return r;
    }));
  };

  const handleCopyLink = (channel: typeof OFFICIAL_SOCIAL_CHANNELS[0]) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(channel.url);
      setCopiedChannelId(channel.id);
      setTimeout(() => setCopiedChannelId(null), 2000);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim()) return;

    setIsSubmitting(true);
    try {
      const submitted = await submitReview({
        authorName: formIsAnonymous ? 'Anonymous Trainer' : (formAuthorName.trim() || 'Trainer'),
        isAnonymous: formIsAnonymous,
        rating: formRating,
        title: formTitle.trim() || `${formRating}-Star Review`,
        comment: formComment.trim(),
        category: formCategory,
        userRole: formUserRole.trim() || (formIsAnonymous ? 'Anonymous Member' : 'Verified Trainer')
      });

      setReviews(prev => [submitted, ...prev.filter(r => r.id !== submitted.id)]);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
        setShowFormModal(false);
        // Reset form
        setFormRating(5);
        setFormTitle('');
        setFormComment('');
        setFormAuthorName('');
        setFormIsAnonymous(false);
      }, 1500);
    } catch (err) {
      console.error('Error posting review:', err);
      setIsSubmitting(false);
    }
  };

  // Structured schema for reviews and social organization
  const seoSchema = useMemo(() => getSocialsPageSchema(stats, reviews), [stats, reviews]);

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A] selection:bg-[#DC143C]/20 selection:text-[#0F172A]">
      <PageHead
        title="Official Socials & Community Reviews | DECK / divider"
        description="Official DECK / divider Reddit (r/DeckDivider), Instagram (@deckdivider), and X (@DeckDivider) community channels. Read community reviews and share your Pokémon TCG feedback."
        canonicalPath="/socials"
        keywords={[
          'pokemon tcg reddit community',
          'deck divider reddit r/DeckDivider',
          'deck divider instagram @deckdivider',
          'deck divider twitter x @DeckDivider',
          'deck divider reviews',
          'pokemon card tracker review',
          'ptcgl deck builder community',
          'pokemon tcg official socials',
          'trainer feedback and ratings',
          'pokemon master set tracker feedback'
        ]}
        schema={seoSchema}
      />

      <LandingNav
        onOpenAuth={() => navigate('/auth')}
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }}
      />

      <main className="flex-grow pt-10 sm:pt-14 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GeoBreadcrumbs
            items={[
              { label: 'Directory', path: '/directory' },
              { label: 'Socials & Community Reviews', path: '/socials' }
            ]}
          />

          {/* Hero Header */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 mb-10 shadow-xs relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DC143C]/10 text-[#DC143C] text-xs font-mono font-bold tracking-wide uppercase mb-4 border border-[#DC143C]/20 shadow-2xs">
                <Users className="w-3.5 h-3.5" />
                Community &amp; Social Hub
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] font-heading tracking-tight mb-4">
                Connect With Trainers &amp; Leave Your Review
              </h1>
              <p className="text-base sm:text-lg text-[#64748B] leading-relaxed mb-6 font-sans">
                Explore our official channels for deck discussions and platform updates. Drop a review to share your feedback with the community.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#reviews"
                  className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-mono text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-2"
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {stats.total > 0 ? `Read ${stats.total} Reviews` : 'Community Reviews'}
                </a>
                <button
                  onClick={() => setShowFormModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#B01030] text-white font-mono text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Drop a Review
                </button>
              </div>
            </div>

            {/* Background Accent Gradient */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-[#DC143C]/5 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Section 1: Official Social Channels */}
          <section id="socials" className="mb-16 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#DC143C] uppercase tracking-wider mb-1">
                  <Share2 className="w-3.5 h-3.5" />
                  Official Channels
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-heading">
                  Community Channels &amp; Badges
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] bg-white border border-[#E2E8F0] px-3.5 py-1.5 rounded-full shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>3 Verified Channels Online</span>
              </div>
            </div>

            {/* Graphic 3-Column Social Channel Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Reddit Badge Card */}
              <div className="bg-white border border-[#E2E8F0] hover:border-[#FF4500]/50 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
                {/* Subtle top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF4500]" />
                
                <div>
                  {/* Channel Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-13 h-13 rounded-2xl bg-[#FFF2ED] border border-[#FFD9CC] flex items-center justify-center text-[#FF4500] shadow-2xs group-hover:scale-105 transition-transform">
                      {/* Reddit Snoo Vector Icon */}
                      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.248a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.56 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                      </svg>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF2ED] text-[#FF4500] border border-[#FFD9CC] text-[10px] font-mono font-bold uppercase tracking-wider">
                        <Check className="w-3 h-3" />
                        Official Subreddit
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">r/DeckDivider</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-[#0F172A] font-heading mb-1.5 flex items-center gap-2">
                    Reddit Community
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed mb-4 font-sans">
                    Join trainer discussions on Pokémon TCG master sets, deck builds, collection showcases, and upcoming expansion checklists.
                  </p>

                  {/* Feature Topic Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {['#MasterSets', '#DeckStrategy', '#CollectionShowcase', '#FeatureRequests'].map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono text-[#475569]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-[#F1F5F9] flex items-center gap-2">
                  <a
                    href="https://www.reddit.com/r/DeckDivider/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#FF4500] hover:bg-[#E03D00] text-white font-mono text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
                  >
                    <span>Join r/DeckDivider</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText('https://www.reddit.com/r/DeckDivider/');
                        setCopiedChannelId('reddit');
                        setTimeout(() => setCopiedChannelId(null), 2000);
                      }
                    }}
                    title="Copy Reddit Link"
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#475569] transition-colors flex items-center justify-center flex-shrink-0"
                    aria-label="Copy Reddit link"
                  >
                    {copiedChannelId === 'reddit' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Instagram Badge Card */}
              <div className="bg-white border border-[#E2E8F0] hover:border-[#E1306C]/50 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
                {/* Subtle top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045]" />
                
                <div>
                  {/* Channel Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#FFF0F5] to-[#FFF7ED] border border-[#FBCFE8] flex items-center justify-center text-[#E1306C] shadow-2xs group-hover:scale-105 transition-transform">
                      {/* Instagram Vector Icon */}
                      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-50 text-[#E1306C] border border-pink-200 text-[10px] font-mono font-bold uppercase tracking-wider">
                        <Check className="w-3 h-3" />
                        Official Account
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">@deckdivider</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-[#0F172A] font-heading mb-1.5 flex items-center gap-2">
                    Instagram Showcase
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed mb-4 font-sans">
                    High-resolution card photography, PSA/BGS 10 gem mint slab showcases, booster openings, and Special Illustration Rares.
                  </p>

                  {/* Feature Topic Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {['#SlabCollector', '#GemMint10', '#SIRPulls', '#CardPhotography'].map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono text-[#475569]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-[#F1F5F9] flex items-center gap-2">
                  <a
                    href="https://www.instagram.com/deckdivider/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#E1306C] hover:opacity-95 text-white font-mono text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
                  >
                    <span>Follow @deckdivider</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText('https://www.instagram.com/deckdivider/');
                        setCopiedChannelId('instagram');
                        setTimeout(() => setCopiedChannelId(null), 2000);
                      }
                    }}
                    title="Copy Instagram Link"
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#475569] transition-colors flex items-center justify-center flex-shrink-0"
                    aria-label="Copy Instagram link"
                  >
                    {copiedChannelId === 'instagram' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Twitter / X Badge Card */}
              <div className="bg-white border border-[#E2E8F0] hover:border-[#0F172A]/50 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
                {/* Subtle top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0F172A]" />
                
                <div>
                  {/* Channel Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-13 h-13 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform">
                      {/* X (Twitter) Vector Icon */}
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[#0F172A] border border-slate-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                        <Check className="w-3 h-3" />
                        Official Handle
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">@DeckDivider</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-[#0F172A] font-heading mb-1.5 flex items-center gap-2">
                    X (Twitter) Feed
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed mb-4 font-sans">
                    Live market price trend alerts, new set database releases, platform changelog updates, and PTCGL meta announcements.
                  </p>

                  {/* Feature Topic Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {['#PriceAlerts', '#TCGMeta', '#Changelog', '#SetReleases'].map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono text-[#475569]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-[#F1F5F9] flex items-center gap-2">
                  <a
                    href="https://x.com/DeckDivider"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-mono text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
                  >
                    <span>Follow @DeckDivider</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText('https://x.com/DeckDivider');
                        setCopiedChannelId('twitter');
                        setTimeout(() => setCopiedChannelId(null), 2000);
                      }
                    }}
                    title="Copy X Link"
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#475569] transition-colors flex items-center justify-center flex-shrink-0"
                    aria-label="Copy X link"
                  >
                    {copiedChannelId === 'twitter' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* Section 2: Reviews & Community Ratings */}
          <section id="reviews" className="mb-16 scroll-mt-24">
            {/* Reviews Header Banner */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Score Overview */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-[#E2E8F0] pb-6 lg:pb-0 lg:pr-8">
                  <div className="text-xs font-mono font-bold text-[#DC143C] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Community Rating Score
                  </div>
                  <div className="flex items-baseline gap-3 my-2">
                    <span className="text-5xl sm:text-6xl font-black text-[#0F172A] font-mono tracking-tight">
                      {stats.total > 0 ? stats.average.toFixed(1) : '—'}
                    </span>
                    <span className="text-lg font-mono text-[#94A3B8]">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-5 h-5 ${
                          stats.total > 0 && s <= Math.round(stats.average)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-[#E2E8F0]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#64748B] font-mono">
                    {stats.total > 0 ? `Based on ${stats.total} trainer reviews` : 'No reviews recorded yet'}
                  </p>

                  <button
                    onClick={() => setShowFormModal(true)}
                    className="mt-6 w-full py-3 px-4 rounded-xl bg-[#DC143C] hover:bg-[#B01030] text-white font-mono text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Write a Review
                  </button>
                </div>

                {/* Right: Breakdown Bars */}
                <div className="lg:col-span-8 space-y-2.5">
                  <h3 className="text-sm font-bold text-[#0F172A] font-mono uppercase tracking-wider mb-3">
                    Rating Distribution
                  </h3>
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const pct = stats.percentages[stars as 1|2|3|4|5] || 0;
                    const count = stats.distribution[stars as 1|2|3|4|5] || 0;

                    return (
                      <div key={stars} className="flex items-center gap-3 text-xs font-mono">
                        <button
                          onClick={() => stats.total > 0 && setSelectedRatingFilter(selectedRatingFilter === stars ? 'all' : stars)}
                          disabled={stats.total === 0}
                          className={`flex items-center gap-1 w-14 font-semibold text-left transition-colors ${
                            selectedRatingFilter === stars ? 'text-[#DC143C]' : 'text-[#0F172A] hover:text-[#DC143C]'
                          }`}
                        >
                          {stars} Stars
                        </button>
                        <div className="flex-1 h-3 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-[#64748B] font-semibold">{pct}%</span>
                        <span className="w-10 text-right text-[#94A3B8] text-[11px]">({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Filter & Sort Bar */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Category Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <span className="text-xs font-mono text-[#94A3B8] flex items-center gap-1 pl-1">
                  <Filter className="w-3.5 h-3.5" />
                  Category:
                </span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#0F172A] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
                  }`}
                >
                  All ({reviews.length})
                </button>
                {REVIEW_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#DC143C] text-white shadow-2xs'
                        : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown & Rating Clear */}
              <div className="flex items-center gap-3 self-end md:self-auto">
                {selectedRatingFilter !== 'all' && (
                  <button
                    onClick={() => setSelectedRatingFilter('all')}
                    className="text-xs font-mono text-[#DC143C] hover:underline"
                  >
                    Clear {selectedRatingFilter}★ filter
                  </button>
                )}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-mono font-semibold text-[#0F172A] py-1.5 px-3 focus:outline-none focus:border-[#DC143C] cursor-pointer"
                >
                  <option value="newest">Most Recent</option>
                  <option value="rating">Highest Rated</option>
                  <option value="likes">Most Helpful</option>
                </select>
              </div>
            </div>

            {/* Reviews Feed */}
            {loadingReviews ? (
              <div className="flex justify-center py-20 bg-white border border-[#E2E8F0] rounded-2xl">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#E2E8F0] border-t-[#DC143C]" />
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center shadow-xs">
                <MessageCircle className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                <h4 className="text-lg font-bold text-[#0F172A] font-heading mb-1">
                  {selectedCategory !== 'all' || selectedRatingFilter !== 'all'
                    ? 'No Reviews in this Filter'
                    : 'No Community Reviews Yet'}
                </h4>
                <p className="text-xs text-[#64748B] mb-4">
                  {selectedCategory !== 'all' || selectedRatingFilter !== 'all'
                    ? 'Try selecting a different category or rating filter.'
                    : 'Be the first Pokémon TCG trainer to share your thoughts, rating, or feature request!'}
                </p>
                <button
                  onClick={() => setShowFormModal(true)}
                  className="px-4 py-2 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-mono font-bold rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Leave a Review
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReviews.map((rev) => {
                  const isLiked = likedReviewsMap[rev.id] || false;

                  return (
                    <div
                      key={rev.id}
                      className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-6 transition-all duration-200 hover:shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Review Top Meta */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs font-mono shadow-2xs ${
                              rev.isAnonymous 
                                ? 'bg-[#F1F5F9] text-[#64748B]' 
                                : 'bg-[#DC143C]/10 text-[#DC143C] border border-[#DC143C]/20'
                            }`}>
                              {rev.isAnonymous ? <UserX className="w-4 h-4" /> : rev.authorName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-[#0F172A] font-heading">
                                  {rev.authorName}
                                </span>
                                {rev.isVerified && (
                                  <span title="Verified Trainer" className="inline-flex items-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] font-mono text-[#94A3B8]">
                                {rev.userRole || (rev.isAnonymous ? 'Anonymous Trainer' : 'Collector')}
                              </span>
                            </div>
                          </div>

                          <span className="text-[11px] font-mono text-[#94A3B8]">
                            {new Date(rev.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Stars & Category Tag */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${
                                  s <= rev.rating
                                    ? 'text-amber-500 fill-amber-500'
                                    : 'text-[#E2E8F0]'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                            {rev.category}
                          </span>
                        </div>

                        {/* Title & Body */}
                        {rev.title && (
                          <h4 className="text-sm font-bold text-[#0F172A] font-heading mb-1.5">
                            {rev.title}
                          </h4>
                        )}
                        <p className="text-xs text-[#475569] leading-relaxed font-sans mb-4 whitespace-pre-line">
                          {rev.comment}
                        </p>
                      </div>

                      {/* Helpful Button */}
                      <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#94A3B8]">
                          {rev.isAnonymous ? 'Posted anonymously' : 'Verified Community Feedback'}
                        </span>
                        <button
                          onClick={(e) => handleLike(rev.id, e)}
                          className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1 rounded-lg border transition-all ${
                            isLiked
                              ? 'bg-[#DC143C]/10 border-[#DC143C]/30 text-[#DC143C]'
                              : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#DC143C]' : ''}`} />
                          <span>Helpful ({rev.likesCount || 0})</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Community Standards Block */}
          <GeoExtractableBlock
            className="mb-12"
            heading="DECK / divider Community Standards"
            summary="DECK / divider is an independent Pokémon Trading Card Game collector checklist, deck builder, and portfolio tracking platform. Our community guidelines encourage transparent, constructive, and helpful feedback from collectors, players, and trainers worldwide."
            keyFacts={[
              { label: 'Official Channels', value: 'r/DeckDivider (Reddit) • @deckdivider (Instagram) • @DeckDivider (X)' },
              { label: 'Trainer Reviews', value: stats.total > 0 ? `${stats.average.toFixed(1)} / 5.0 (${stats.total} Reviews)` : 'Open for Community Reviews' },
              { label: 'Review Privacy Options', value: 'Verified Trainer Name or Anonymous Submission' },
              { label: 'Direct Support', value: 'deckdivider@outlook.com' },
            ]}
          />

          {/* Community FAQs */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#DC143C] uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" />
              Frequently Asked Questions
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading mb-6">
              Community & Feedback FAQ
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SOCIAL_FAQS.map((faq, idx) => (
                <div key={idx} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-[#0F172A] font-heading mb-2">
                    {faq.question}
                  </h4>
                  <p className="text-xs text-[#64748B] leading-relaxed font-sans">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Review Submission Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#CBD5E1] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute right-5 top-5 text-[#94A3B8] hover:text-[#0F172A] p-2 rounded-xl border border-transparent hover:border-[#E2E8F0] transition-colors"
              aria-label="Close Modal"
            >
              ✕
            </button>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] font-heading mb-2">
                  Review Submitted!
                </h3>
                <p className="text-sm text-[#64748B]">
                  Thank you for helping other Pokémon TCG trainers. Your feedback is now live.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview}>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#DC143C] uppercase tracking-wider mb-1">
                  <Star className="w-4 h-4 fill-[#DC143C]" />
                  Community Feedback
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] font-heading mb-1">
                  Leave an App Review
                </h3>
                <p className="text-xs text-[#64748B] mb-6">
                  Share your experience with the master set checklist, deck builder, or slab portfolio tracker.
                </p>

                {/* Rating Selector */}
                <div className="mb-6">
                  <label className="block text-xs font-mono font-bold text-[#0F172A] uppercase mb-2">
                    Overall Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormRating(s)}
                        onMouseEnter={() => setFormHoverRating(s)}
                        onMouseLeave={() => setFormHoverRating(0)}
                        className="p-1 rounded-lg focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            s <= (formHoverRating || formRating)
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-[#E2E8F0]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-[#0F172A] ml-2">
                      {(formHoverRating || formRating)} / 5
                    </span>
                  </div>
                </div>

                {/* Privacy / Identity Selector */}
                <div className="mb-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4">
                  <label className="block text-xs font-mono font-bold text-[#0F172A] uppercase mb-2">
                    Author Identity
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setFormIsAnonymous(false)}
                      className={`p-3 rounded-xl border text-left text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                        !formIsAnonymous
                          ? 'bg-white border-[#0F172A] text-[#0F172A] shadow-xs'
                          : 'bg-transparent border-[#CBD5E1] text-[#64748B]'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-[#DC143C]" />
                      Display Name
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormIsAnonymous(true)}
                      className={`p-3 rounded-xl border text-left text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                        formIsAnonymous
                          ? 'bg-white border-[#0F172A] text-[#0F172A] shadow-xs'
                          : 'bg-transparent border-[#CBD5E1] text-[#64748B]'
                      }`}
                    >
                      <UserX className="w-4 h-4 text-[#64748B]" />
                      Stay Anonymous
                    </button>
                  </div>

                  {!formIsAnonymous ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-mono text-[#64748B] mb-1">
                          Display Name / Trainer Handle
                        </label>
                        <input
                          type="text"
                          required={!formIsAnonymous}
                          value={formAuthorName}
                          onChange={(e) => setFormAuthorName(e.target.value)}
                          placeholder="e.g. MasterTrainer99 or Marcus"
                          className="w-full bg-white border border-[#CBD5E1] rounded-xl py-2 px-3.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#DC143C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#64748B] mb-1">
                          Trainer Role / Focus
                        </label>
                        <input
                          type="text"
                          value={formUserRole}
                          onChange={(e) => setFormUserRole(e.target.value)}
                          placeholder="e.g. Master Set Collector, PTCGL Competitor, Investor"
                          className="w-full bg-white border border-[#CBD5E1] rounded-xl py-2 px-3.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#DC143C]"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] font-mono text-[#64748B]">
                      Your review will be posted publicly with the author tag <strong className="text-[#0F172A]">"Anonymous Trainer"</strong>.
                    </p>
                  )}
                </div>

                {/* Category Selector */}
                <div className="mb-4">
                  <label className="block text-xs font-mono font-bold text-[#0F172A] uppercase mb-1.5">
                    Feature Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ReviewCategory)}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl py-2 px-3 text-xs font-mono font-semibold text-[#0F172A] focus:outline-none focus:border-[#DC143C]"
                  >
                    {REVIEW_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Review Headline */}
                <div className="mb-4">
                  <label className="block text-xs font-mono font-bold text-[#0F172A] uppercase mb-1.5">
                    Review Headline (Optional)
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Cleanest master set checklist with reverse holos"
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl py-2 px-3.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#DC143C]"
                  />
                </div>

                {/* Review Body */}
                <div className="mb-6">
                  <label className="block text-xs font-mono font-bold text-[#0F172A] uppercase mb-1.5">
                    Your Detailed Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Tell us what you like about the app, features you use the most, or improvements you'd like to see..."
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#DC143C] resize-none"
                  />
                  <span className="text-[10px] font-mono text-[#94A3B8] block text-right mt-1">
                    {formComment.length} / 2000 characters
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] text-xs font-mono font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formComment.trim()}
                    className="px-6 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#B01030] disabled:opacity-50 text-white text-xs font-mono font-bold transition-all shadow-2xs inline-flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Post Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <LandingFooter />
    </div>
  );
};
