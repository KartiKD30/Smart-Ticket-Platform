import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Wallet } from 'lucide-react';
import api from '../utils/api';
import AnimatedPage, { AnimatedSection } from '../components/ui/AnimatedPage';
import { cardVariants, listVariants, springTransition, tableRowVariants } from '../utils/motion';

const Earnings = () => {
  const [payoutData, setPayoutData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPayouts = async () => {
    try {
      const res = await api.get('/payouts');
      setPayoutData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleRequestPayout = async () => {
    if (payoutData?.totalEarnings === undefined) return;
    const requestAmount = payoutData.totalEarnings > 0 ? payoutData.totalEarnings : 500;
    try {
      const payload = { amount: requestAmount };
      if (payoutData?.defaultEventId) {
        payload.eventId = payoutData.defaultEventId;
      }

      await api.post('/payouts/request', payload);
      fetchPayouts();
    } catch (err) {
      console.error(err);
      alert('Failed to request payout. Check console.');
    }
  };

  const handleCompletePayout = async (id) => {
    try {
      await api.put(`/payouts/${id}/complete`);
      fetchPayouts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <AnimatedPage>
        <AnimatedSection className="panel-card p-8">Loading earnings...</AnimatedSection>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <AnimatedSection>
        <h2 className="text-3xl font-bold tracking-tight">Earnings & Payouts</h2>
        <p className="mt-1 text-muted-foreground">Manage your revenue and track payout statuses with smoother cards and table motion.</p>
      </AnimatedSection>

      <motion.div className="grid grid-cols-1 gap-6 md:grid-cols-3" variants={listVariants} initial="initial" animate="animate">
        {[
          { label: 'Total Earnings', value: payoutData?.totalEarnings?.toLocaleString(), icon: Wallet, tone: 'text-primary' },
          { label: 'Pending Payouts', value: payoutData?.pendingPayouts?.toLocaleString(), icon: Clock, tone: 'text-orange-500' },
          { label: 'Completed Payouts', value: payoutData?.completedPayouts?.toLocaleString(), icon: CheckCircle2, tone: 'text-green-500' },
        ].map((item) => (
          <motion.div key={item.label} className="panel-card flex flex-col justify-center" variants={cardVariants} whileHover={{ y: -6 }}>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <item.icon className={`h-4 w-4 ${item.tone}`} />
              {item.label}
            </div>
            <div className={`text-4xl font-bold tracking-tight ${item.tone}`}>Rs {item.value}</div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatedSection className="glass-table mt-2">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-lg font-semibold">Payout History</h3>
          <motion.button
            onClick={handleRequestPayout}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={springTransition}
          >
            Request Payout
          </motion.button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <motion.tbody className="divide-y divide-border" variants={listVariants} initial="initial" animate="animate">
            {payoutData?.payoutHistory?.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">No payouts requested yet.</td>
              </tr>
            )}
            {payoutData?.payoutHistory?.map((payout) => (
              <motion.tr key={payout._id} className="transition-colors hover:bg-muted/50" variants={tableRowVariants}>
                <td className="px-6 py-4 font-medium">{new Date(payout.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-muted-foreground">{payout.eventId?.title || payout.eventId?.name || 'All Events'}</td>
                <td className="px-6 py-4 font-bold text-foreground">Rs {payout.amount?.toLocaleString()}</td>
                <td className="px-6 py-4 flex items-center gap-4">
                  <span
                    className={`flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                      payout.status === 'completed'
                        ? 'border-green-500/20 bg-green-500/10 text-green-500'
                        : 'border-orange-500/20 bg-orange-500/10 text-orange-500'
                    }`}
                  >
                    {payout.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </span>
                  {payout.status === 'pending' && (
                    <button
                      onClick={() => handleCompletePayout(payout._id)}
                      className="text-[10px] font-bold uppercase text-primary hover:underline"
                      title="Simulate Admin Completion"
                    >
                      Mark Completed
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </AnimatedSection>
    </AnimatedPage>
  );
};

export default Earnings;
