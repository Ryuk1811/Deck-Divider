import React from 'react';
import { ShieldCheck, TrendingDown, Layers, Search, LayoutTemplate, Activity, Zap, Users } from 'lucide-react';

export const LandingFeatureGrid: React.FC = () => {
  const features = [
    {
      title: 'Price-Drop Alerts',
      description: 'Custom target prices for singles and slabs. Instant notifications when market prices hit your range.',
      icon: <TrendingDown className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      span: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1 md:row-span-2',
    },
    {
      title: 'Master Set Trackers',
      description: 'Full set completions. Independent tracking for reverse holos, Secret Rares, and promos.',
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      span: 'col-span-1 lg:col-span-1 row-span-1',
    },
    {
      title: 'Tournament Deck Verification',
      description: 'Automatic flags for rotated blocks, banned cards, and rule-of-four violations.',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      span: 'col-span-1 lg:col-span-1 row-span-1',
    },
    {
      title: 'Instant Database Search',
      description: 'Millisecond search. Filters for illustrator, HP, attack damage, and format legality.',
      icon: <Search className="w-6 h-6 text-sky-600" />,
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      span: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1 md:row-span-2',
    },
    {
      title: 'Graded Slab Registry',
      description: 'PSA, BGS, and CGC certificate logging. Subgrade tracking and real-time slab premiums.',
      icon: <LayoutTemplate className="w-5 h-5 text-fuchsia-600" />,
      bg: 'bg-fuchsia-50',
      border: 'border-fuchsia-100',
      span: 'col-span-1 lg:col-span-1 row-span-1',
    },
    {
      title: 'Multi-Currency Live NAV',
      description: 'Dynamic portfolio valuation in USD, EUR, GBP, JPY, and more.',
      icon: <Activity className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      span: 'col-span-1 lg:col-span-1 row-span-1',
    },
    {
      title: 'Real-time Sync',
      description: 'All your data updates instantly across all your devices seamlessly.',
      icon: <Zap className="w-5 h-5 text-yellow-600" />,
      bg: 'bg-yellow-50',
      border: 'border-yellow-100',
      span: 'col-span-1 md:col-span-2 lg:col-span-1 row-span-1',
    },
    {
      title: 'Social Sharing',
      description: 'Share your decks, lists, and collections with the global community.',
      icon: <Users className="w-5 h-5 text-teal-600" />,
      bg: 'bg-teal-50',
      border: 'border-teal-100',
      span: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-1',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-min max-w-7xl mx-auto">
        {features.map((feature, i) => (
          <div
            key={i}
            className={`p-5 sm:p-6 lg:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between items-start gap-4 transform-gpu ${feature.span}`}
            data-motion-reveal
            data-motion-delay={(0.04 * (i % 4)).toFixed(2)}
            data-motion-tilt
          >
            <div className={`p-3 rounded-2xl ${feature.bg} ${feature.border} border shadow-2xs`}>
              {feature.icon}
            </div>
            <div className="space-y-2 mt-auto">
              <h3 className="text-lg font-bold text-slate-900 font-heading">{feature.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
