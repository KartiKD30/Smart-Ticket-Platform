import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import { springTransition } from '../../utils/motion';

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
      <main className="flex-1 p-4 lg:p-5">
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
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition hover:text-white"
            >
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-sm font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Signed in</p>
                <p className="font-semibold text-white">{username}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className="panel-surface p-5 lg:p-7"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04, duration: 0.2 }}>
              <Outlet />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
