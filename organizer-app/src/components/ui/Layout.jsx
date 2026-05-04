import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import { springTransition } from '../../utils/motion';

/* Page transition variants — fade + slight translateY, no blur to avoid GPU cost */
const pageTransitionVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Organizer';

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-5" style={{ minWidth: 0 }}>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.header
          className="panel-header mb-6 flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-7"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Ticket Seer</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">Organizer Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition hover:text-white"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={springTransition}
            >
              <Bell className="h-5 w-5" />
            </motion.button>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-sm font-bold text-white"
                whileHover={{ scale: 1.08 }}
                transition={springTransition}
              >
                {username.charAt(0).toUpperCase()}
              </motion.div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Signed in</p>
                <p className="font-semibold text-white">{username}</p>
              </div>
            </div>
            <motion.button
              type="button"
              onClick={handleLogout}
              className="btn-glow inline-flex items-center gap-2 rounded-2xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={springTransition}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </motion.button>
          </div>
        </motion.header>

        {/* ── Page Content with AnimatePresence ─────────────────────── */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ willChange: 'opacity, transform' }}
          >
            <div className="panel-surface p-5 lg:p-7">
              <Outlet />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
