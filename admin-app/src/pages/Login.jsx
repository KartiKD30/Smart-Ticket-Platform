import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ShieldAlert, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login(email, password);
            if (!result?.access) {
                throw new Error('Login failed');
            }
            toast.success('Login Successful! Welcome to Ticket Seer Admin');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.error || err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top left, rgba(229,9,20,0.16), transparent 24%), linear-gradient(180deg, #000 0%, #0a0a0a 100%)'
        }}>
            <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '460px', padding: '48px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        background: 'rgba(229, 9, 20, 0.12)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        border: '1px solid rgba(229, 9, 20, 0.2)'
                    }}>
                        <ShieldAlert size={36} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>Ticket Seer Admin</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Secure access to the platform control room</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{
                        marginBottom: '20px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: 'rgba(229, 9, 20, 0.08)',
                        border: '1px solid rgba(229, 9, 20, 0.18)',
                        fontSize: '13px',
                        color: 'var(--text-muted)'
                    }}>
                        Dev login: <strong style={{ color: 'var(--text-main)' }}>admin</strong> / <strong style={{ color: 'var(--text-main)' }}>admin123</strong>
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>USERNAME OR EMAIL</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="admin or admin@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', paddingLeft: '48px' }}
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', paddingLeft: '48px' }}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '16px', fontSize: '16px' }}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Authenticate Access'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
