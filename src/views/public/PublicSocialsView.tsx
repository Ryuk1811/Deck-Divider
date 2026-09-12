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
  Clock
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { CommunityReview, ReviewCategory } from '../../types';
import { OFFICIAL_SOCIAL_CHANNELS, SOCIAL_FAQS } from '../../data/socialsData';
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
  const seoSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'DECK / divider',
    description: 'Free Pokémon TCG card checklist, 60-card PTCGL deck builder, and slab tracker.'
  };

  if (stats.total > 0) {
    seoSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: stats.average,
      reviewCount: stats.total,
      bestRating: '5',
      worstRating: '1'
    };
    seoSchema.review = reviews.slice(0, 10).map(r => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.isAnonymous ? 'Anonymous Trainer' : r.authorName
      },
      datePublished: r.createdAt.slice(0, 10),
      reviewBody: r.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: '5',
        worstRating: '1'
      }
    }));
  }

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A] selection:bg-[#DC143C]/20 selection:text-[#0F172A]">
      <PageHead
        title="Official Socials & Community Reviews | DECK / divider"
        description="Official DECK / divider Discord, X (Twitter), YouTube, and GitHub channels. Read community reviews and share your Pokémon TCG feedback."
        canonicalPath="/socials"
        keywords={[
          'pokemon tcg discord community',
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
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-12 text-center shadow-xs">
              <div className="w-14 h-14 bg-[#DC143C]/10 text-[#DC143C] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#DC143C]/20">
                <Clock className="w-7 h-7" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] text-xs font-mono font-bold uppercase tracking-wider mb-3">
                Coming Soon
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-heading mb-3">
                Official Channels Coming Soon
              </h3>
              <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed mb-6 font-sans">
                Our verified community spaces and official channels are currently being prepared. In the meantime, you can read community reviews and share your feedback below.
              </p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="#reviews"
                  className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-mono text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-2"
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  View Community Reviews
                </a>
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
              { label: 'Community Status', value: 'Official Social Channels Coming Soon' },
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
