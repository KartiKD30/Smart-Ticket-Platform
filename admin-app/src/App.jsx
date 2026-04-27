import React from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  TrendingUp,
  ShieldCheck,
  LogOut,
  Ticket,
  Wallet,
  Sparkles,
  Bell
} from 'lucide-react';

import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import EventsPage from './pages/EventsPage';
import UsersPage from './pages/UsersPage';
import RevenuePage from './pages/RevenuePage';
import AuditLog from './pages/AuditLog';
import ResalesPage from './pages/ResalesPage';
import PayoutsPage from './pages/PayoutsPage';

function App() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Routes><Route path="/login" element={<Login />} /></Routes>;
  }

  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/events', label: 'Events', icon: Calendar },
    { to: '/users', label: 'Users', icon: Users },
    { to: '/revenue', label: 'Revenue', icon: TrendingUp },
    { to: '/resales', label: 'Resale Requests', icon: Ticket },
    { to: '/payouts', label: 'Payouts', icon: Wallet },
    { to: '/audit', label: 'Audit Logs', icon: ShieldCheck },
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar premium-shadow">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', padding: '6px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #e50914, #b20710)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles color="white" size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>Control Room</div>
            <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.03em' }}>Ticket Seer Admin</span>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <link.icon size={20} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '18px 12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              {user.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>{user.username}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.54)' }}>Platform Administrator</div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              marginTop: '14px',
              padding: '12px 16px',
              background: 'rgba(239,68,68,0.14)',
              color: 'white',
              border: '1px solid rgba(239,68,68,0.22)',
              borderRadius: '14px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', padding: '18px 22px', borderRadius: '24px', background: 'rgba(18,18,18,0.82)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.24)' }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)', fontWeight: 700 }}>Ticket Seer</div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginTop: '6px', color: 'white' }}>Admin Dashboard</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ width: '42px', height: '42px', borderRadius: '14px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
              <Bell size={18} />
            </button>
            <div style={{ padding: '10px 14px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontWeight: 700 }}>
              Live platform overview
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/resales" element={<ResalesPage />} />
          <Route path="/payouts" element={<PayoutsPage />} />
          <Route path="/audit" element={<AuditLog />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
