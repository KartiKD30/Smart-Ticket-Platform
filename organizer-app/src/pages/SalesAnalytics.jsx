import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { BarChart3, Sparkles, Ticket, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import AnimatedPage, { AnimatedSection, SkeletonCard } from '../components/ui/AnimatedPage';
import { cardVariants, listVariants, springTransition } from '../utils/motion';

/* ─── Analytics Skeleton ─────────────────────────────────────────────────── */
const AnalyticsSkeleton = () => (
  <div className="space-y-8">
    <div className="skeleton h-40 w-full rounded-[28px]" />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <SkeletonCard lines={4} className="h-80" />
      <SkeletonCard lines={4} className="h-80" />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
const SalesAnalytics = () => {
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [trendRes, categoryRes] = await Promise.all([
          api.get('/analytics/sales-trend'),
          api.get('/analytics/category-breakdown'),
        ]);
        setTrendData(
          trendRes.data.map((item) => ({
            date: item._id,
            revenue: item.revenue,
            tickets: item.tickets,
          }))
        );
        setCategoryData(categoryRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const totalRevenue = trendData.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalTickets = trendData.reduce((sum, item) => sum + (item.tickets || 0), 0);

  if (loading) return <AnalyticsSkeleton />;

  return (
    <AnimatedPage>
      {/* ── Hero Banner ───────────────────────────────────────────────── */}
      <AnimatedSection className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(229,9,20,0.18),transparent_28%),linear-gradient(135deg,#111111,#171717)] p-7">
        <div className="grid-glow absolute inset-0 opacity-30" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow-chip border-red-500/20 bg-red-500/10 text-red-400">
              <Sparkles className="h-4 w-4" />
              Revenue Intelligence
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">Sales Analytics</h2>
            <p className="mt-2 max-w-2xl text-white/65">
              Deep dive into your revenue, ticket velocity, and category performance.
            </p>
          </div>

          {/* Inline stat chips */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={listVariants}
            initial="initial"
            animate="animate"
          >
            {[
              { label: 'Total Revenue', value: `Rs ${totalRevenue.toLocaleString()}`, icon: TrendingUp },
              { label: 'Tickets Tracked', value: totalTickets.toLocaleString(), icon: Ticket },
            ].map((item) => (
              <motion.div
                key={item.label}
                className="panel-card min-w-[180px] bg-white/[0.03]"
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{ willChange: 'transform' }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                  <item.icon className="h-4 w-4 text-red-400" />
                </div>
                <p className="mt-4 text-2xl font-bold text-white">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ── Chart Cards ───────────────────────────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        variants={listVariants}
        initial="initial"
        animate="animate"
      >
        {/* Revenue Trend — Area Chart */}
        <motion.div
          className="panel-card"
          variants={cardVariants}
          whileHover={{
            y: -6,
            boxShadow: '0 28px 60px rgba(229,9,20,0.13), 0 10px 26px rgba(0,0,0,0.38)',
            transition: { duration: 0.22, ease: 'easeOut' },
          }}
          style={{ willChange: 'transform' }}
        >
          <div className="mb-6">
            <div className="eyebrow-chip border-white/10 bg-white/5 text-white/55">
              <BarChart3 className="h-4 w-4" />
              Flow
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Revenue Trend</h3>
            <p className="text-sm text-muted-foreground">
              Cumulative revenue growth over the last 7 days.
            </p>
          </div>
          <div className="h-[300px] w-full min-w-0 min-h-0">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.72} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs${v}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderRadius: '12px',
                      border: '1px solid hsl(var(--border))',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    animationDuration={1400}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Revenue by Category — Bar Chart */}
        <motion.div
          className="panel-card"
          variants={cardVariants}
          whileHover={{
            y: -6,
            boxShadow: '0 28px 60px rgba(229,9,20,0.13), 0 10px 26px rgba(0,0,0,0.38)',
            transition: { duration: 0.22, ease: 'easeOut' },
          }}
          style={{ willChange: 'transform' }}
        >
          <div className="mb-6">
            <div className="eyebrow-chip border-white/10 bg-white/5 text-white/55">
              <Sparkles className="h-4 w-4" />
              Split
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Revenue by Category</h3>
            <p className="text-sm text-muted-foreground">
              Which ticket types generate the most revenue?
            </p>
          </div>
          <div className="h-[300px] w-full min-w-0 min-h-0">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs${v}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <RechartsTooltip
                    cursor={{ fill: 'rgba(229,9,20,0.07)' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderRadius: '12px',
                      border: '1px solid hsl(var(--border))',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
                    }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} animationDuration={1200} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          {categoryData.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">No organizer sales yet for category breakdown.</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
};

export default SalesAnalytics;
