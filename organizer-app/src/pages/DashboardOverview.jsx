import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Users, Ticket, DollarSign, Calendar as CalendarIcon, Sparkles, ArrowUpRight } from 'lucide-react';
import api from '../utils/api';
import AnimatedPage, { AnimatedSection, AnimatedCard, AnimatedButton, SkeletonCard } from '../components/ui/AnimatedPage';
import { listVariants, springTransition } from '../utils/motion';

/* ─── Count-up hook ──────────────────────────────────────────────────────── */
const useCountUp = (target, duration = 1.2) => {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (target === 0 || target === undefined) return;
    const numTarget = typeof target === 'number' ? target : parseFloat(String(target).replace(/,/g, '')) || 0;
    const controls = animate(count, numTarget, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString()),
    });
    return controls.stop;
  }, [target, duration]);

  return display;
};

/* ─── Animated Progress Bar ──────────────────────────────────────────────── */
const AnimatedProgressBar = ({ pct }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const clampedPct = Math.min(pct || 0, 100);

  return (
    <div ref={ref} className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <motion.div
        className="h-1.5 rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={inView ? { width: `${clampedPct}%` } : {}}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        style={{ willChange: 'width' }}
      />
    </div>
  );
};

/* ─── KPI Stat Card ──────────────────────────────────────────────────────── */
const StatCard = ({ title, value, rawValue, icon: Icon, percentage, delay = 0 }) => {
  const countDisplay = useCountUp(rawValue ?? 0);

  return (
    <motion.div
      className="stat-tile flex flex-col justify-between gap-4"
      variants={{
        initial: { opacity: 0, y: 20, scale: 0.96 },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { delay, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      whileHover={{
        y: -6,
        boxShadow: '0 28px 60px rgba(229,9,20,0.14), 0 10px 26px rgba(0,0,0,0.38)',
        transition: { duration: 0.22, ease: 'easeOut' },
      }}
      style={{ willChange: 'transform' }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <motion.div
          className="rounded-2xl bg-primary/10 p-3 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          whileHover={{ scale: 1.12, rotate: -5 }}
          transition={springTransition}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </div>
      <div>
        <div className="text-3xl font-semibold tracking-tight">
          {rawValue !== undefined ? (
            /* Count-up for numeric values */
            title === 'Total Revenue' ? `Rs ${countDisplay}` : countDisplay
          ) : value}
        </div>
        {percentage !== undefined && (
          <div className="mt-2 text-sm text-muted-foreground">
            <span className={percentage >= 50 ? 'text-green-500 font-medium' : 'text-primary font-medium'}>
              {percentage.toFixed(1)}%
            </span>{' '}
            capacity sold
            <AnimatedProgressBar pct={percentage} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Dashboard skeleton ─────────────────────────────────────────────────── */
const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="skeleton h-8 w-44 rounded-full" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <SkeletonCard lines={4} className="lg:col-span-2 h-64" />
      <SkeletonCard lines={3} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
const DashboardOverview = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, trendRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/sales-trend'),
        ]);
        setData(overviewRes.data);
        setChartData(
          trendRes.data.map((item) => ({
            date: item._id,
            revenue: item.revenue,
            tickets: item.tickets,
          }))
        );
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── Skeleton loading state (no blank screen) ──────────────────── */
  if (loading) return <DashboardSkeleton />;

  return (
    <AnimatedPage>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <AnimatedSection className="flex items-center justify-between">
        <div>
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-red-400"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08, ...springTransition }}
          >
            <Sparkles className="h-4 w-4" />
            Live overview
          </motion.div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Overview</h2>
          <p className="mt-1 text-muted-foreground">Here's your sales snapshot for the active events.</p>
        </div>
      </AnimatedSection>

      {/* ── KPI Cards ───────────────────────────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={listVariants}
        initial="initial"
        animate="animate"
      >
        <StatCard
          title="Total Revenue"
          rawValue={data?.totalRevenue || 0}
          icon={DollarSign}
          delay={0.04}
        />
        <StatCard
          title="Tickets Sold"
          rawValue={data?.ticketsSold || 0}
          value={(data?.ticketsSold || 0).toLocaleString()}
          icon={Ticket}
          percentage={data?.sellThroughRate || 0}
          delay={0.09}
        />
        <StatCard
          title="Total Seats"
          rawValue={data?.totalSeats || 0}
          icon={Users}
          delay={0.14}
        />
        <StatCard
          title="Upcoming Events"
          rawValue={data?.upcomingEvents || 0}
          icon={CalendarIcon}
          delay={0.19}
        />
      </motion.div>

      {/* ── Charts ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AnimatedSection className="panel-surface p-6 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Sales Trend (Last 7 Days)</h3>
            <p className="text-sm text-muted-foreground">Revenue generated over time.</p>
          </div>
          <div className="h-[300px] w-full min-w-0 min-h-0">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `Rs ${v}`}
                  />
                  <Tooltip
                    cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 1 }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderRadius: '16px',
                      border: '1px solid hsl(var(--border))',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    animationDuration={1400}
                    animationEasing="ease-out"
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 7, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </AnimatedSection>

        {/* ── Payout CTA ─────────────────────────────────────────────── */}
        <AnimatedSection className="panel-surface flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_20px_35px_rgba(229,9,20,0.16)]"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <DollarSign className="h-8 w-8" />
          </motion.div>
          <h3 className="mb-2 text-xl font-semibold">Ready for Payout</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Your earnings are ready to be transferred to your bank account.
          </p>
          <AnimatedButton
            onClick={() => navigate('/earnings')}
            className="btn-glow inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Request Payout
            <ArrowUpRight className="h-4 w-4" />
          </AnimatedButton>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
};

export default DashboardOverview;
