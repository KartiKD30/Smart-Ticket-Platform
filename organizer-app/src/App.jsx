import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { logNavigation } from './utils/navigation';
import Layout from './components/ui/Layout';
import DashboardOverview from './pages/DashboardOverview';
import EventManagement from './pages/EventManagement';
import SalesAnalytics from './pages/SalesAnalytics';
import ResaleMonitoring from './pages/ResaleMonitoring';
import Earnings from './pages/Earnings';
import PromoCodes from './pages/PromoCodes';
import Login from './pages/Login';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function OrganizerRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('access');
  const role = localStorage.getItem('role');

  const loggedRef = useRef(false);

  useEffect(() => {
    // Navigation guard logic is active, logs removed for production stability
  }, [location.pathname]);

  if (!token || role !== 'organizer') {
    console.warn('[OrganizerRoute] Access denied. Redirecting to login.', { hasToken: !!token, role });
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function App() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <OrganizerRoute>
              <Layout />
            </OrganizerRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="analytics" element={<SalesAnalytics />} />
          <Route path="resale" element={<ResaleMonitoring />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="promos" element={<PromoCodes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
