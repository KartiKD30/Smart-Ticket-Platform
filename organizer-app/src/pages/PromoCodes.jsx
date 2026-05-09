import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import api from '../utils/api';
import AnimatedPage, {
  AnimatedSection,
  AnimatedButton,
  SkeletonRow,
} from '../components/ui/AnimatedPage';
import { listVariants, springTransition } from '../utils/motion';

const extractEvents = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.events)) return payload.events;
  return [];
};

/* ─── Table row variants for stagger ─────────────────────────────────────── */
const rowVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
};

/* ═══════════════════════════════════════════════════════════════════════════ */
const PromoCodes = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    eventId: '',
    discountType: 'percentage',
    discountValue: '',
    usageLimit: '',
    expiryDate: '',
  });

  const fetchPromos = async () => {
    try {
      setError('');
      const res = await api.get('/promos');
      setPromos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to load promo codes.');
      setPromos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/organizer/my-events');
      setEvents(extractEvents(res.data));
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchPromos();
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/promos', {
        ...formData,
        discountValue: Number(formData.discountValue),
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      });
      setIsModalOpen(false);
      fetchPromos();
      setFormData({ code: '', eventId: '', discountType: 'percentage', discountValue: '', usageLimit: '', expiryDate: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to create promo code.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promo code?')) return;
    try {
      await api.delete(`/promos/${id}`);
      fetchPromos();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to delete promo code.');
    }
  };

  return (
    <AnimatedPage>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <AnimatedSection className="flex items-center justify-between">
        <div>
          <div className="eyebrow-chip border-red-500/20 bg-red-500/10 text-red-400">
            <Sparkles className="h-4 w-4" />
            Conversion Boosters
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Promo Codes</h2>
          <p className="mt-1 text-muted-foreground">
            Create discount codes with a premium control panel.
          </p>
        </div>
        <AnimatedButton
          onClick={() => setIsModalOpen(true)}
          disabled={events.length === 0}
          className="btn-glow flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-5 w-5" />
          Create Promo
        </AnimatedButton>
      </AnimatedSection>

      {/* ── Alerts ──────────────────────────────────────────────────── */}
      {events.length === 0 && !loading && (
        <AnimatedSection className="panel-card p-4 text-sm text-muted-foreground">
          Create an event first, then promo codes will be available here.
        </AnimatedSection>
      )}
      {error && (
        <AnimatedSection className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </AnimatedSection>
      )}

      {/* ── Table ───────────────────────────────────────────────────── */}
      <AnimatedSection className="glass-table">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Uses</th>
              <th className="px-6 py-4">Expires</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <motion.tbody
            className="divide-y divide-border"
            variants={listVariants}
            initial="initial"
            animate="animate"
          >
            {/* Skeleton rows while loading */}
            {loading && [0, 1, 2].map((i) => <SkeletonRow key={i} cols={6} />)}

            {!loading && promos.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">
                  No promo codes active.
                </td>
              </tr>
            )}

            <AnimatePresence>
              {!loading &&
                promos.map((promo) => (
                  <motion.tr
                    key={promo._id}
                    className="table-row-hover"
                    variants={rowVariants}
                    layout
                    exit="exit"
                  >
                    <td className="px-6 py-4 font-bold tracking-wider">
                      <motion.span
                        className="rounded bg-muted px-2 py-1 text-foreground font-mono"
                        whileHover={{ scale: 1.04 }}
                        transition={springTransition}
                      >
                        {promo.code}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {promo.eventId?.title || promo.eventId?.name || 'Assigned Event'}
                    </td>
                    <td className="px-6 py-4 font-medium text-green-500">
                      {promo.discountType === 'percentage'
                        ? `${promo.discountValue}% OFF`
                        : `Rs ${promo.discountValue} OFF`}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {promo.timesUsed} / {promo.usageLimit || '∞'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(promo.expiryDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      <motion.button
                        onClick={() => handleDelete(promo._id)}
                        className="rounded-lg p-2 transition-colors hover:bg-destructive/10 hover:text-destructive"
                        whileHover={{ scale: 1.12, rotate: 5 }}
                        whileTap={{ scale: 0.92 }}
                        transition={springTransition}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </AnimatedSection>

      {/* ── Create Modal ─────────────────────────────────────────────── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Promo Code">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Promo Code</label>
            <input
              required
              type="text"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g. SUMMER26"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Target Event</label>
            <select
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
            >
              <option value="" disabled>Select Event...</option>
              {events.map((ev) => (
                <option key={ev._id} value={ev._id}>{ev.title || ev.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Discount Type</label>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Value</label>
              <input
                required
                type="number"
                min="1"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Usage Limit (Optional)</label>
              <input
                type="number"
                placeholder="Leave empty for unlimited"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Expiry Date</label>
              <input
                required
                type="date"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4 text-sm">
            <AnimatedButton
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg bg-muted px-4 py-2 font-medium text-muted-foreground hover:bg-muted/80"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              type="submit"
              className="btn-glow rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create Code
            </AnimatedButton>
          </div>
        </form>
      </Modal>
    </AnimatedPage>
  );
};

export default PromoCodes;
