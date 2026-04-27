import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgePercent,
  CalendarClock,
  CircleDollarSign,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  Ticket,
  Users,
} from 'lucide-react';
import API from '../services/api';
import Modal from '../components/ui/Modal';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const emptyForm = {
  code: '',
  eventId: '',
  discountType: 'percentage',
  discountValue: '',
  usageLimit: '',
  expiryDate: '',
};

const formatEventName = (event) => event?.title || event?.name || 'All Events';

const formatExpiryLabel = (expiryDate) => {
  const date = new Date(expiryDate);

  if (Number.isNaN(date.getTime())) {
    return 'No expiry';
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getDaysRemaining = (expiryDate) => {
  const target = new Date(expiryDate);
  const now = new Date();

  if (Number.isNaN(target.getTime())) {
    return null;
  }

  const diffInDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffInDays;
};

const PromoCodes = () => {
  const [promos, setPromos] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem('access');
  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const fetchPromos = async () => {
    const response = await API.get('/promos', { headers: authHeaders });
    setPromos(Array.isArray(response.data) ? response.data : []);
  };

  const fetchEvents = async () => {
    const response = await API.get('/events/organizer/my-events', { headers: authHeaders });
    setEvents(response.data?.data || []);
  };

  useEffect(() => {
    const loadPage = async () => {
      if (!token) {
        setError('Organizer login required to manage promo codes.');
        setLoading(false);
        return;
      }

      try {
        setError('');
        setLoading(true);
        await Promise.all([fetchPromos(), fetchEvents()]);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Unable to load promo data right now.');
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [token]);

  const stats = useMemo(() => {
    const activePromos = promos.filter((promo) => getDaysRemaining(promo.expiryDate) >= 0);
    const totalUses = promos.reduce((sum, promo) => sum + (promo.timesUsed || 0), 0);
    const unlimitedPromos = promos.filter((promo) => !promo.usageLimit).length;
    const averageDiscount =
      promos.length > 0
        ? Math.round(
            promos.reduce((sum, promo) => sum + Number(promo.discountValue || 0), 0) / promos.length
          )
        : 0;

    return [
      {
        label: 'Active Codes',
        value: activePromos.length,
        note: `${promos.length} total created`,
        icon: Tag,
      },
      {
        label: 'Total Redemptions',
        value: totalUses,
        note: 'Uses tracked across all promos',
        icon: Users,
      },
      {
        label: 'Average Discount Value',
        value: promos.length ? averageDiscount : 0,
        note: 'Blended across percentage and fixed campaigns',
        icon: BadgePercent,
      },
      {
        label: 'Unlimited Codes',
        value: unlimitedPromos,
        note: 'No redemption cap applied',
        icon: Sparkles,
      },
    ];
  }, [promos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Organizer login required to create promo codes.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await API.post(
        '/promos',
        {
          ...formData,
          eventId: formData.eventId || null,
          discountValue: Number(formData.discountValue),
          usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        },
        { headers: authHeaders }
      );

      setIsModalOpen(false);
      setFormData(emptyForm);
      await fetchPromos();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to create promo code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promo code?')) return;

    try {
      setError('');
      await API.delete(`/promos/${id}`, { headers: authHeaders });
      await fetchPromos();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to delete promo code.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-48 rounded-[32px] border border-white/10 bg-white/5" />
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-32 rounded-[24px] border border-white/10 bg-white/5" />
            ))}
          </div>
          <div className="h-80 rounded-[32px] border border-white/10 bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen px-4 py-10 text-white sm:px-6 lg:px-8"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.section
          variants={cardVariants}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(229,9,20,0.28),_transparent_34%),linear-gradient(135deg,_rgba(26,26,26,0.98),_rgba(10,10,10,0.96))] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.35)] md:p-8"
        >
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
                <Sparkles className="h-4 w-4 text-amber-300" />
                Promo Control Room
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                  Turn quiet inventory into fast-moving drops.
                </h2>
                <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">
                  Launch polished campaign codes, attach them to your events, and keep an eye on
                  redemption momentum without leaving the dashboard.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-black/25 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Live Promos</p>
                <p className="mt-2 text-3xl font-black">{stats[0].value}</p>
                <p className="mt-1 text-sm text-white/60">Running across your organizer catalog</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/25 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Redemptions</p>
                <p className="mt-2 text-3xl font-black">{stats[1].value}</p>
                <p className="mt-1 text-sm text-white/60">Use this to spot your strongest hooks</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section variants={cardVariants} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_16px_42px_rgba(0,0,0,0.22)] backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/65">{stat.label}</span>
                  <span className="rounded-2xl border border-white/10 bg-white/5 p-2 text-red-300">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black tracking-tight text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-white/55">{stat.note}</p>
              </article>
            );
          })}
        </motion.section>

        <motion.section
          variants={cardVariants}
          className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.24)] backdrop-blur md:p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white">Promo inventory</h3>
              <p className="mt-2 text-sm text-white/60">
                Every code, expiry, and usage cap in one cleaner view.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 font-semibold text-white shadow-[0_18px_34px_rgba(229,9,20,0.28)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110"
            >
              <Plus className="h-5 w-5" />
              Create Promo
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          {promos.length === 0 ? (
            <div className="mt-6 rounded-[28px] border border-dashed border-white/12 bg-black/20 px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-red-300">
                <Ticket className="h-7 w-7" />
              </div>
              <h4 className="mt-5 text-xl font-bold text-white">No promo codes yet</h4>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
                Create your first offer to spark urgency, reward early buyers, or lift slow-moving
                events.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-white">
                  <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.24em] text-white/45">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Code</th>
                      <th className="px-5 py-4 font-semibold">Event</th>
                      <th className="px-5 py-4 font-semibold">Discount</th>
                      <th className="px-5 py-4 font-semibold">Usage</th>
                      <th className="px-5 py-4 font-semibold">Expires</th>
                      <th className="px-5 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8 bg-black/10">
                    {promos.map((promo) => {
                      const daysRemaining = getDaysRemaining(promo.expiryDate);
                      const isExpired = daysRemaining !== null && daysRemaining < 0;
                      const discountLabel =
                        promo.discountType === 'percentage'
                          ? `${promo.discountValue}% OFF`
                          : `Rs ${promo.discountValue} OFF`;

                      return (
                        <tr key={promo._id} className="transition hover:bg-white/[0.03]">
                          <td className="px-5 py-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 font-semibold tracking-[0.18em] text-white">
                              <Tag className="h-4 w-4 text-red-300" />
                              {promo.code}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-white/72">{formatEventName(promo.eventId)}</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/12 px-3 py-2 font-semibold text-emerald-300">
                              <CircleDollarSign className="h-4 w-4" />
                              {discountLabel}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-white/72">
                            {promo.timesUsed || 0} / {promo.usageLimit || 'Unlimited'}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col gap-1 text-white/72">
                              <span className="inline-flex items-center gap-2">
                                <CalendarClock className="h-4 w-4 text-amber-300" />
                                {formatExpiryLabel(promo.expiryDate)}
                              </span>
                              <span className={`text-xs ${isExpired ? 'text-red-300' : 'text-white/45'}`}>
                                {isExpired
                                  ? 'Expired'
                                  : daysRemaining === 0
                                    ? 'Ends today'
                                    : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left`}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleDelete(promo._id)}
                              className="inline-flex items-center gap-2 rounded-2xl border border-red-500/15 bg-red-500/10 px-3 py-2 font-medium text-red-200 transition hover:bg-red-500/15"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.section>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Promo Code">
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Promo Code</label>
              <input
                required
                type="text"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                placeholder="SUMMER26"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Target Event</label>
              <select
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              >
                <option value="" disabled>
                  Select Event...
                </option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title || event.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Discount Type</label>
              <select
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs)</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Discount Value</label>
              <input
                required
                type="number"
                min="1"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Usage Limit</label>
              <input
                type="number"
                placeholder="Leave empty for unlimited"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Expiry Date</label>
              <input
                required
                type="date"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 font-medium text-white/75 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              {submitting ? 'Creating...' : 'Create Code'}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default PromoCodes;
