import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await api.post('/auth/login/', form);
      const { access, username, role } = response.data;

      if (role !== 'organizer') {
        setError('This login is only for organizer accounts.');
        localStorage.removeItem('access');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        return;
      }

      localStorage.setItem('access', access);
      localStorage.setItem('username', username || form.username);
      localStorage.setItem('role', role);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your organizer credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(229,9,20,0.2),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_20%),linear-gradient(135deg,#000000,#090909_55%,#141414)]">
      <motion.div
        className="w-full max-w-5xl overflow-hidden rounded-[34px] border border-white/10 bg-black/40 shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:grid lg:grid-cols-[1.1fr_0.9fr]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="p-8 text-white lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-white/80">
            <Sparkles className="h-4 w-4" />
            Ticket Seer Studio
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight lg:text-5xl">Run events from a darker, sharper control room.</h1>
          <p className="mt-4 max-w-xl text-white/72">
            Manage approvals, revenue, promos, and live operations./
          </p>
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/8 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Dev Login</p>
            <p className="mt-3 text-lg font-semibold">organizer / organizer123</p>
          </div>
        </div>

        <div className="bg-[#101010] p-8 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Organizer Access</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Sign in</h2>
          <p className="mt-2 text-sm text-white/55">Use your organizer account to manage live inventory and revenue.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/85">Username or Email</label>
              <input
                type="text"
                value={form.username}
                onChange={handleChange('username')}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-red-500 focus:bg-black focus:outline-none focus:ring-4 focus:ring-red-500/10"
                placeholder="organizer@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/85">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-red-500 focus:bg-black focus:outline-none focus:ring-4 focus:ring-red-500/10"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
            >
              {submitting ? 'Signing in...' : 'Continue to dashboard'}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
