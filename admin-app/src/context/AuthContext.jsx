import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (token && role === 'admin') {
            setUser({
                username: username || 'admin',
                role
            });
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/admin/login', { username: email, password });
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('username', res.data.username || email);
        localStorage.setItem('role', res.data.role || 'admin');
        setUser({ username: res.data.username || email, role: res.data.role || 'admin' });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
