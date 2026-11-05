import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Boxes, Calculator, Layers, Sparkles } from 'lucide-react';

export const PublicMobileNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Don't render on /app authenticated routes as /app has its own dashboard navigation
  if (currentPath.startsWith('/app') || currentPath.startsWith('/auth')) {
    return null;
  }

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
      isActive: currentPath === '/'
    },
    {
      label: 'Cards',
      path: '/cards',
      icon: Search,
      isActive: currentPath.startsWith('/cards') || currentPath.startsWith('/card/') || currentPath.startsWith('/pokemon')
    },
    {
      label: 'Sets',
      path: '/sets',
      icon: Boxes,
      isActive: currentPath.startsWith('/sets') || currentPath.startsWith('/set/') || currentPath.startsWith('/expansions')
    },
    {
      label: 'Tools',
      path: '/tools',
      icon: Calculator,
      isActive: currentPath.startsWith('/tools') || currentPath.startsWith('/compare')
    },
    {
      label: 'Studio App',
      path: '/app',
      icon: Layers,
      isActive: false,
      isSpecial: true
    }
  ];

  return (
    <nav 
      aria-label="Public Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 pb-safe pt-1 transition-all"
    >
      <div className="grid grid-cols-5 items-center h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isSpecial) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-[#DC143C] text-white active:scale-95 transition-all shadow-xs my-1"
                aria-label="Enter DECK / divider Studio App"
              >
                <Icon className="w-4 h-4 text-white" />
                <span className="text-[10px] font-extrabold tracking-tight mt-0.5">
                  Studio
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-all relative ${
                item.isActive
                  ? 'text-[#DC143C] font-bold'
                  : 'text-slate-500 hover:text-slate-900 active:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${item.isActive ? 'text-[#DC143C] stroke-[2.5]' : 'text-slate-500'}`} />
              <span className="text-[10px] font-medium tracking-tight mt-1 line-clamp-1">
                {item.label}
              </span>
              {item.isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-[#DC143C] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
export default PublicMobileNav;
