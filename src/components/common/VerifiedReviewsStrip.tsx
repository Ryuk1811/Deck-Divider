import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, ArrowRight, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { getCommunityReviews, calculateReviewStats, CommunityReview } from '../../lib/reviewsService';

interface VerifiedReviewsStripProps {
  categoryFilter?: string;
  maxItems?: number;
  className?: string;
  showStatsHeader?: boolean;
}

export const VerifiedReviewsStrip: React.FC<VerifiedReviewsStripProps> = ({
  categoryFilter,
  maxItems = 3,
  className = '',
  showStatsHeader = true
}) => {
  const [reviews, setReviews] = useState<CommunityReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getCommunityReviews()
      .then(all => {
        if (!mounted) return;
        let pool = all;
        if (categoryFilter && categoryFilter !== 'all') {
          pool = all.filter(r => r.category === categoryFilter);
        }
        // Pick top-rated high detail reviews
        const sorted = [...pool].sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return (b.likesCount || 0) - (a.likesCount || 0);
        });
        setReviews(sorted.slice(0, maxItems));
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load reviews in VerifiedReviewsStrip:', err);
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [categoryFilter, maxItems]);

  const stats = calculateReviewStats(reviews);

  return (
    <div className={`w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs ${className}`}>
      {showStatsHeader && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#DC143C]/10 border border-[#DC143C]/20 flex items-center justify-center text-[#DC143C] shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-[#0F172A] font-heading">
                  4.7
                </span>
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-[#64748B]">
                  (1,000+ Verified Trainer Reviews)
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-sans mt-0.5">
                Rated #1 independent Pokémon TCG collection tracker and PTCGL tournament deck builder.
              </p>
            </div>
          </div>

          <Link
            to="/socials#reviews"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#0F172A] text-xs font-mono font-bold text-[#0F172A] hover:bg-[#F1F5F9] transition-all shadow-2xs shrink-0"
          >
            <span>Read All Reviews</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#DC143C]" />
          </Link>
        </div>
      )}

      {/* Grid of Verified Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 animate-pulse h-36" />
          ))
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-5 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-[#E2E8F0]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                    {rev.category}
                  </span>
                </div>

                {rev.title && (
                  <h4 className="text-xs font-bold text-[#0F172A] font-heading mb-1 line-clamp-1">
                    {rev.title}
                  </h4>
                )}
                <p className="text-xs text-[#475569] leading-relaxed font-sans line-clamp-3 mb-3">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                <div className="flex items-center gap-1 truncate">
                  <span className="font-bold text-[#0F172A] truncate">{rev.authorName}</span>
                  {rev.isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                </div>
                <span className="text-[10px] text-[#94A3B8] shrink-0">{rev.userRole}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
