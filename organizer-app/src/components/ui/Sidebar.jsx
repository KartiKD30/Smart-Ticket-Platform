import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, BarChart3, Wallet, Tag, Sparkles } from 'lucide-react';
import { listVariants, sidebarItemVariants, springTransition } from '../../utils/motion';

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
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={springTransition}
    >
      <div className="rounded-[28px] border border-white/8 bg-black/90 text-white shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl p-5 h-full">

        {/* ── Brand ─────────────────────────────────────────────────── */}
        <motion.div
          className="mb-8 px-2"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            whileHover={{ y: -2, scale: 1.02, borderColor: 'rgba(229,9,20,0.35)' }}
            transition={springTransition}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-[0_8px_20px_rgba(229,9,20,0.38)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Organizer Suite</p>
              <h1 className="text-xl font-bold tracking-tight">Ticket Seer</h1>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Nav Items ─────────────────────────────────────────────── */}
        <motion.nav
          className="space-y-1.5"
          variants={listVariants}
          initial="initial"
          animate="animate"
        >
          {links.map((link, i) => (
            <motion.div
              key={link.name}
              variants={sidebarItemVariants}
              custom={i}
              whileHover={{ x: 3, scale: 1.02 }}
              whileTap={{ scale: 0.975 }}
              transition={springTransition}
            >
              <NavLink
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-[0_8px_28px_rgba(229,9,20,0.32),0_2px_8px_rgba(229,9,20,0.2)]'
                      : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active side indicator */}
                    {isActive && (
                      <motion.span
                        className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-white/60"
                        layoutId="nav-indicator"
                        transition={springTransition}
                      />
                    )}

                    {/* Icon with subtle rotation on active */}
                    <motion.div
                      animate={isActive ? { rotate: [0, -8, 0] } : { rotate: 0 }}
                      transition={{ duration: 0.32 }}
                      className="shrink-0"
                    >
                      <link.icon className="h-5 w-5" />
                    </motion.div>

                    <span>{link.name}</span>

                    {/* Hover glow */}
                    {!isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                        style={{
                          background:
                            'radial-gradient(circle at 30% 50%, rgba(229,9,20,0.07), transparent 70%)',
                        }}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.22 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </motion.nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
