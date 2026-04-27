import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import {
    TrendingUp,
    Users,
    Calendar,
    IndianRupee,
    ArrowUpRight,
    Layers,
    PlusCircle,
    Settings,
    Bell,
    BarChart3,
    PieChart,
    Activity
} from 'lucide-react';

const DashboardHome = () => {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/admin/stats');
                setDashboardData(res.data);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            }
        };

        fetchDashboard();
    }, []);

    const stats = dashboardData?.stats || {};
    const revenueByCategory = dashboardData?.revenueByCategory || {};

    const statItems = [
        { label: 'TOTAL REVENUE', value: `Rs ${Number(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: <IndianRupee />, color: 'var(--success)' },
        { label: 'ACTIVE USERS', value: (stats.activeUsers || 0).toLocaleString(), icon: <Users />, color: 'var(--primary)' },
        { label: 'ORGANIZERS', value: (stats.totalOrganizers || 0).toLocaleString(), icon: <Layers />, color: 'var(--accent)' },
        { label: 'ACTIVE EVENTS', value: (stats.activeEvents || 0).toLocaleString(), icon: <Calendar />, color: 'var(--warning)' }
    ];

    return (
        <motion.div
            className="animate-slide-up"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
        >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '999px', background: 'rgba(91,140,255,0.08)', color: 'var(--primary)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '16px' }}>
                <Activity size={14} />
                High signal overview
            </div>
            <header style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '18px' }}>Manage and monitor platform performance.</p>
            </header>

            <div className="stat-grid">
                {statItems.map((item, idx) => (
                    <motion.div
                        key={idx}
                        className="stat-card premium-shadow"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.35 }}
                        whileHover={{ y: -8 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ padding: '12px', background: `${item.color}15`, borderRadius: '14px', color: item.color }}>
                                {React.cloneElement(item.icon, { size: 24 })}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontSize: '12px', fontWeight: '700' }}>
                                <ArrowUpRight size={14} /> 12%
                            </div>
                        </div>
                        <div style={{ marginTop: '24px' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', letterSpacing: '0.05em' }}>{item.label}</span>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '8px', color: 'var(--text-main)' }}>{item.value}</h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="glass-card"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.4 }}
                whileHover={{ y: -4 }}
            >
                <div className="animate-float" style={{ padding: '24px', background: 'var(--primary)15', borderRadius: '50%', marginBottom: '24px' }}>
                    <TrendingUp size={48} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Platform Snapshot</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '320px' }}>
                    {Object.keys(revenueByCategory).length
                        ? `Top categories: ${Object.entries(revenueByCategory)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([name]) => name)
                            .join(', ')}`
                        : 'Revenue by category will appear here once bookings are available.'}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.button whileHover={{ y: -6 }} className="glass-card-action-btn p-4 border border-gray-300 rounded-[18px] hover:bg-gray-50">
                    <PlusCircle size={20} />
                    <span className="ml-2">Create Event</span>
                </motion.button>
                <motion.button whileHover={{ y: -6 }} className="glass-card-action-btn p-4 border border-gray-300 rounded-[18px] hover:bg-gray-50">
                    <Users size={20} />
                    <span className="ml-2">Manage Users</span>
                </motion.button>
                <motion.button whileHover={{ y: -6 }} className="glass-card-action-btn p-4 border border-gray-300 rounded-[18px] hover:bg-gray-50">
                    <Activity size={20} />
                    <span className="ml-2">View Activity</span>
                </motion.button>
                <motion.button whileHover={{ y: -6 }} className="glass-card-action-btn p-4 border border-gray-300 rounded-[18px] hover:bg-gray-50">
                    <BarChart3 size={20} />
                    <span className="ml-2">Analytics</span>
                </motion.button>
                <motion.button whileHover={{ y: -6 }} className="glass-card-action-btn p-4 border border-gray-300 rounded-[18px] hover:bg-gray-50">
                    <PieChart size={20} />
                    <span className="ml-2">Reports</span>
                </motion.button>
                <motion.button whileHover={{ y: -6 }} className="glass-card-action-btn p-4 border border-gray-300 rounded-[18px] hover:bg-gray-50">
                    <Settings size={20} />
                    <span className="ml-2">Settings</span>
                </motion.button>
                <motion.button whileHover={{ y: -6 }} className="glass-card-action-btn p-4 border border-gray-300 rounded-[18px] hover:bg-gray-50">
                    <Bell size={20} />
                    <span className="ml-2">Notifications</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default DashboardHome;
