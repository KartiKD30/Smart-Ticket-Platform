import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, BarChart3, Wallet, Tag, Sparkles } from 'lucide-react';
import { cardVariants, listVariants, springTransition } from '../../utils/motion';

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
      <motion.div
        className="rounded-[28px] border border-white/8 bg-black/90 text-white shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl p-5 h-full"
        variants={cardVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div className="mb-8 px-2" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.35 }}>
          <motion.div
            className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            whileHover={{ y: -2, scale: 1.01 }}
            transition={springTransition}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Organizer Suite</p>
              <h1 className="text-xl font-bold tracking-tight">Ticket Seer</h1>
            </div>
          </motion.div>
        </motion.div>

        <motion.nav className="space-y-2" variants={listVariants} initial="initial" animate="animate">
          {links.map((link) => (
            <motion.div key={link.name} variants={cardVariants}>
              <NavLink
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-[0_18px_35px_rgba(229,9,20,0.25)]'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={springTransition}
                  >
                    <motion.div animate={isActive ? { rotate: [0, -10, 0] } : { rotate: 0 }} transition={{ duration: 0.35 }}>
                      <link.icon className="h-5 w-5" />
                    </motion.div>
                    {link.name}
                  </motion.div>
                )}
              </NavLink>
            </motion.div>
          ))}
        </motion.nav>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
