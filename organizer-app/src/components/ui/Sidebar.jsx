import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, BarChart3, Wallet, Tag, Sparkles } from 'lucide-react';
import { springTransition } from '../../utils/motion';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Earnings', path: '/earnings', icon: Wallet },
    { name: 'Promo Codes', path: '/promos', icon: Tag },
  ];

  return (
    <motion.aside
      className="w-full lg:w-[290px] lg:min-h-screen lg:sticky lg:top-0 p-4 lg:p-5"
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={springTransition}
    >
      <div className="rounded-[28px] border border-white/8 bg-black/90 text-white shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl p-5 h-full">
        <div className="mb-8 px-2">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-[0_8px_20px_rgba(229,9,20,0.38)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Organizer Suite</p>
              <h1 className="text-xl font-bold tracking-tight">Ticket Seer</h1>
            </div>
          </div>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-[0_8px_28px_rgba(229,9,20,0.32),0_2px_8px_rgba(229,9,20,0.2)]'
                    : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-white/60" />
                  )}
                  <link.icon className="h-5 w-5 shrink-0" />
                  <span>{link.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
