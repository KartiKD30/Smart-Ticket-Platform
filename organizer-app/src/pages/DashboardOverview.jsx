import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Users, Ticket, DollarSign, Calendar as CalendarIcon, Sparkles, ArrowUpRight } from 'lucide-react';
import api from '../utils/api';

const StatCard = ({ title, value, icon: Icon, percentage, delay = 0 }) => (
  <motion.div
    className="stat-tile flex flex-col justify-between gap-4"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    whileHover={{ y: -8 }}
  >
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="rounded-2xl bg-primary/10 p-3 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div>
      <div className="text-3xl font-semibold tracking-tight">{value}</div>
      {percentage !== undefined && (
        <div className="mt-2 text-sm text-muted-foreground">
          <span className={percentage >= 50 ? 'text-green-500 font-medium' : 'text-primary font-medium'}>
            {percentage.toFixed(1)}%
          </span> capacity sold
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
            <div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.min(percentage, 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, trendRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/sales-trend')
        ]);

        setData(overviewRes.data);
        setChartData(trendRes.data.map(item => ({
          date: item._id,
          revenue: item.revenue,
          tickets: item.tickets
        })));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
    </div>
  );

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-blue-600">
            <Sparkles className="h-4 w-4" />
            Live overview
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Overview</h2>
          <p className="mt-1 text-muted-foreground">Here's your sales snapshot for the active events.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={`Rs ${(data?.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} delay={0.05} />
        <StatCard title="Tickets Sold" value={(data?.ticketsSold || 0).toLocaleString()} icon={Ticket} percentage={data?.sellThroughRate || 0} delay={0.1} />
        <StatCard title="Total Seats" value={(data?.totalSeats || 0).toLocaleString()} icon={Users} delay={0.15} />
        <StatCard title="Upcoming Events" value={data?.upcomingEvents || 0} icon={CalendarIcon} delay={0.2} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          className="panel-surface p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Sales Trend (Last 7 Days)</h3>
            <p className="text-sm text-muted-foreground">Revenue generated over time.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs ${value}`} />
                <Tooltip cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 1 }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))' }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  animationDuration={1200}
                  animationEasing="ease-out"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="panel-surface flex flex-col items-center justify-center p-6 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          whileHover={{ y: -6 }}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_20px_35px_rgba(91,140,255,0.16)]">
            <DollarSign className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Ready for Payout</h3>
          <p className="mb-6 text-sm text-muted-foreground">Your earnings are ready to be transferred to your bank account.</p>
          <button onClick={() => navigate('/earnings')} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-medium text-primary-foreground transition hover:opacity-90">
            Request Payout
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
