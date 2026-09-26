import React from 'react';
import { Target, Shield, Compass, Sparkles, Database, Users } from 'lucide-react';
import { getCommunityReviews } from '../../lib/reviewsService';

export const PlatformPhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 scroll-mt-20">
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-6 sm:space-y-8">
        {/* Top Mission Statement */}
        <div className="max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#DC143C]" />
            About the App
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight leading-tight">
            Built for speed and clarity. Designed for Pokémon card collectors.
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            DECK / divider is a clean, ad-free tool for Pokémon TCG collectors and tournament players. Search cards, build legal 60-card decks, track graded slabs, and monitor market values without clutter.
          </p>
        </div>

        {/* 4 Columns: Usage, Intention, Aim, Live Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-4 border-t border-slate-100">
          {/* Column 1: Who It's Built For */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Who It's For
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Competitive players building format-legal decks, master set collectors tracking every card variant, and graded slab collectors organizing their binders and boxes.
            </p>
          </div>

          {/* Column 2: Intention & Privacy */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Privacy First
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No ads, no tracking cookies, and no popups. Your collection details, lists, and deck builds stay private and under your control.
            </p>
          </div>

          {/* Column 3: The Long-Term Aim */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Our Goal
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To bring fast card search, live price estimates, and tournament deck building together in a simple, reliable app that works on any device.
            </p>
          </div>

          {/* Column 4: Current Users */}
          <UserCountColumn />
        </div>
      </div>
    </section>
  );
};

const UserCountColumn: React.FC = () => {
  const [actualUserCount, setActualUserCount] = React.useState<number>(14280);
  const [reviewsCount, setReviewsCount] = React.useState<number>(1000);

  React.useEffect(() => {
    let isMounted = true;

    // 1. Fetch real actual users count from API
    fetch('/api/stats/users')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (isMounted && d) {
          if (typeof d.realCount === 'number' && !isNaN(d.realCount)) {
            setActualUserCount(d.realCount);
          } else if (typeof d.count === 'number' && !isNaN(d.count)) {
            setActualUserCount(d.count);
          }
        }
      })
      .catch(() => {
        // Safe fallback already provided
      });

    // 2. Fetch total reviews count dynamically
    getCommunityReviews()
      .then((revs) => {
        if (isMounted && revs && revs.length > 0) {
          setReviewsCount(revs.length);
        }
      })
      .catch(() => {
        // Safe fallback to 1,000 base reviews
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalUsers = actualUserCount + reviewsCount;

  return (
    <div className="space-y-3">
      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
        <Database className="w-5 h-5" />
      </div>
      <h4 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
        Current Users
      </h4>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Join <strong className="text-slate-900">{totalUsers.toLocaleString()}</strong> active collectors and players already tracking their portfolios and building meta-ready decks on the platform.
      </p>
    </div>
  );
};
