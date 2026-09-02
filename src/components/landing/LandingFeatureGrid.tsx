import React from 'react';
import { ShieldCheck, TrendingDown, Layers, Search, LayoutTemplate, Activity } from 'lucide-react';

export const LandingFeatureGrid: React.FC = () => {
  const features = [
    {
      title: 'Price-Drop Alerts',
      description: 'Custom target prices for singles and slabs. Instant notifications when market prices hit your range.',
      icon: <TrendingDown className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      title: 'Master Set Trackers',
      description: 'Full set completions. Independent tracking for reverse holos, Secret Rares, and promos.',
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
    {
      title: 'Tournament Deck Verification',
      description: 'Automatic flags for rotated blocks, banned cards, and rule-of-four violations before League Cups.',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      title: 'Instant Database Search',
      description: 'Millisecond search. Filters for illustrator, HP, attack damage, format legality, and set number.',
      icon: <Search className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50',
      border: 'border-sky-100',
    },
    {
      title: 'Graded Slab Registry',
      description: 'PSA, BGS, and CGC certificate logging. Subgrade tracking and real-time slab premiums.',
      icon: <LayoutTemplate className="w-5 h-5 text-fuchsia-600" />,
      bg: 'bg-fuchsia-50',
      border: 'border-fuchsia-100',
    },
    {
      title: 'Multi-Currency Live NAV',
      description: 'Dynamic portfolio valuation in USD, EUR, GBP, JPY, and more. Powered by live TCGplayer sales.',
      icon: <Activity className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {features.map((feature, i) => (
          <div key={i} className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-shadow flex flex-col items-start gap-3.5">
            <div className={`p-2.5 rounded-xl ${feature.bg} ${feature.border} border`}>
              {feature.icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-heading">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
