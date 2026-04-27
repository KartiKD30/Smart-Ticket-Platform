import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart3, Sparkles, Ticket, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import AnimatedPage, { AnimatedSection } from '../components/ui/AnimatedPage';
import { cardVariants, listVariants } from '../utils/motion';

const SalesAnalytics = () => {
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

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
          })),
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

  return (
    <AnimatedPage>
      <AnimatedSection className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(229,9,20,0.18),transparent_28%),linear-gradient(135deg,#111111,#171717)] p-7">
        <div className="grid-glow absolute inset-0 opacity-30" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow-chip border-red-500/20 bg-red-500/10 text-red-400">
              <Sparkles className="h-4 w-4" />
              Revenue Intelligence
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">Sales Analytics</h2>
            <p className="mt-2 max-w-2xl text-white/65">Deep dive into your revenue, ticket velocity, and category performance with a sharper live view.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Revenue', value: `Rs ${totalRevenue.toLocaleString()}`, icon: TrendingUp },
              { label: 'Tickets Tracked', value: totalTickets.toLocaleString(), icon: Ticket },
            ].map((item) => (
              <motion.div key={item.label} className="panel-card min-w-[180px] bg-white/[0.03]" variants={cardVariants}>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                  <item.icon className="h-4 w-4 text-red-400" />
                </div>
                <p className="mt-4 text-2xl font-bold text-white">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {loading ? (
        <AnimatedSection className="panel-card p-8 text-center text-muted-foreground">Loading analytics...</AnimatedSection>
      ) : (
        <motion.div className="grid grid-cols-1 gap-6 lg:grid-cols-2" variants={listVariants} initial="initial" animate="animate">
          <motion.div className="panel-card" variants={cardVariants} whileHover={{ y: -6 }}>
            <div className="mb-6">
              <div className="eyebrow-chip border-white/10 bg-white/5 text-white/55">
                <BarChart3 className="h-4 w-4" />
                Flow
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">Revenue Trend</h3>
              <p className="text-sm text-muted-foreground">Visualizing cumulative revenue growth over the last 7 days.</p>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className="panel-card" variants={cardVariants} whileHover={{ y: -6 }}>
            <div className="mb-6">
              <div className="eyebrow-chip border-white/10 bg-white/5 text-white/55">
                <Sparkles className="h-4 w-4" />
                Split
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">Revenue by Category</h3>
              <p className="text-sm text-muted-foreground">Which ticket types generate the most revenue?</p>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <RechartsTooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {categoryData.length === 0 && <p className="mt-4 text-sm text-muted-foreground">No organizer sales yet for category breakdown.</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatedPage>
  );
};

export default SalesAnalytics;
