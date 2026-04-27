import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import api from '../utils/api';
import AnimatedPage, { AnimatedSection } from '../components/ui/AnimatedPage';
import { listVariants, springTransition, tableRowVariants } from '../utils/motion';

const extractEvents = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.events)) return payload.events;
  return [];
};

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

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      <AnimatedSection className="flex items-center justify-between">
        <div>
          <div className="eyebrow-chip border-red-500/20 bg-red-500/10 text-red-400">
            <Sparkles className="h-4 w-4" />
            Conversion Boosters
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Promo Codes</h2>
          <p className="mt-1 text-muted-foreground">Create discount codes with a more premium control panel and animated list transitions.</p>
        </div>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          disabled={events.length === 0}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          whileHover={events.length ? { y: -2, scale: 1.01 } : undefined}
          whileTap={events.length ? { scale: 0.98 } : undefined}
          transition={springTransition}
        >
          <Plus className="h-5 w-5" />
          Create Promo
        </motion.button>
      </AnimatedSection>

      {events.length === 0 && !loading && <AnimatedSection className="panel-card p-4 text-sm text-muted-foreground">Create an event first, then promo codes will be available here.</AnimatedSection>}
      {error && <AnimatedSection className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</AnimatedSection>}

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
          <motion.tbody className="divide-y divide-border" variants={listVariants} initial="initial" animate="animate">
            {loading && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">Loading promo codes...</td>
              </tr>
            )}
            {!loading && promos.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">No promo codes active.</td>
              </tr>
            )}
            {!loading &&
              promos.map((promo) => (
                <motion.tr key={promo._id} className="transition-colors hover:bg-muted/50" variants={tableRowVariants}>
                  <td className="px-6 py-4 font-bold tracking-wider"><span className="rounded bg-muted px-2 py-1 text-foreground">{promo.code}</span></td>
                  <td className="px-6 py-4 text-muted-foreground">{promo.eventId?.title || promo.eventId?.name || 'Assigned Event'}</td>
                  <td className="px-6 py-4 font-medium text-green-500">{promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `Rs ${promo.discountValue} OFF`}</td>
                  <td className="px-6 py-4 text-muted-foreground">{promo.timesUsed} / {promo.usageLimit || 'Infinity'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(promo.expiryDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    <motion.button onClick={() => handleDelete(promo._id)} className="rounded-lg p-2 transition-colors hover:bg-destructive/10 hover:text-destructive" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}>
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
          </motion.tbody>
        </table>
      </AnimatedSection>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Promo Code">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Promo Code</label>
            <input required type="text" className="w-full rounded-lg border border-border bg-background px-3 py-2" placeholder="e.g. SUMMER26" value={formData.code} onChange={(event) => setFormData({ ...formData, code: event.target.value.toUpperCase() })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Target Event</label>
            <select required className="w-full rounded-lg border border-border bg-background px-3 py-2" value={formData.eventId} onChange={(event) => setFormData({ ...formData, eventId: event.target.value })}>
              <option value="" disabled>Select Event...</option>
              {events.map((ev) => <option key={ev._id} value={ev._id}>{ev.title || ev.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Discount Type</label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2" value={formData.discountType} onChange={(event) => setFormData({ ...formData, discountType: event.target.value })}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Value</label>
              <input required type="number" min="1" className="w-full rounded-lg border border-border bg-background px-3 py-2" value={formData.discountValue} onChange={(event) => setFormData({ ...formData, discountValue: event.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Usage Limit (Optional)</label>
              <input type="number" placeholder="Leave empty for unlimited" className="w-full rounded-lg border border-border bg-background px-3 py-2" value={formData.usageLimit} onChange={(event) => setFormData({ ...formData, usageLimit: event.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Expiry Date</label>
              <input required type="date" className="w-full rounded-lg border border-border bg-background px-3 py-2" value={formData.expiryDate} onChange={(event) => setFormData({ ...formData, expiryDate: event.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4 text-sm">
            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg bg-muted px-4 py-2 font-medium text-muted-foreground hover:bg-muted/80">Cancel</button>
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">Create Code</button>
          </div>
        </form>
      </Modal>
    </AnimatedPage>
  );
};

export default PromoCodes;
