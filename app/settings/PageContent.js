'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useQuery } from '@tanstack/react-query';

const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
};

export default function SettingsPage() {
    const [currentPin, setCurrentPin] = useState('');
    const router = useRouter();
    const [view, setView] = useState('loading'); // 'loading', 'auth', 'settings'
    const [authMode, setAuthMode] = useState('login'); // 'login', 'register'

    // Auth Form State
    const [authData, setAuthData] = useState({ pin: '', name: '', email: '' });
    const [generatedPin, setGeneratedPin] = useState(null);
    const [loading, setLoading] = useState(false);

    // Settings Form State
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        officeName: '',
        email: '',
        officeTime: '',
        isOnline: true
    });

    // React Query for settings - will be hydrated if prefetched
    const { data: settingsData, isSuccess, refetch } = useQuery({
        queryKey: ['settings'],
        queryFn: fetchSettings,
        staleTime: Infinity, // Settings rarely change, keep fresh
        retry: false,
        enabled: view === 'settings' // Only fetch/use when in settings view
    });

    useEffect(() => {
        checkAuth();
    }, []);

    // Sync form data with fetched settings
    useEffect(() => {
        if (isSuccess && settingsData) {
            setFormData({
                officeName: settingsData.officeName || '',
                email: settingsData.email || '',
                officeTime: settingsData.officeTime || '',
                isOnline: settingsData.isOnline !== undefined ? settingsData.isOnline : true
            });
        }
    }, [isSuccess, settingsData]);

    const checkAuth = () => {
        const match = document.cookie.match(new RegExp('(^| )officePin=([^;]+)'));
        if (match && match[2]) {
            setCurrentPin(match[2]);
            setView('settings');
            // 'enabled: view === settings' will trigger query or use hydrated data
        } else {
            setView('auth');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin: authData.pin })
            });

            if (res.ok) {
                document.cookie = `officePin=${authData.pin}; path=/; max-age=${60 * 60 * 24 * 30}`;
                setCurrentPin(authData.pin);
                setView('settings');
                // Force reload to update header immediately and ensure clean state
                window.location.href = '/settings';
            } else {
                alert("Invalid PIN");
            }
        } catch (error) {
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: authData.name, email: authData.email })
            });

            const data = await res.json();
            if (res.ok) {
                setGeneratedPin(data.pin);
            } else {
                alert(data.error || "Registration failed");
            }
        } catch (error) {
            alert("Registration error");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert("Settings saved successfully!");
                refetch(); // Update local data
                window.location.reload(); // Reload to refresh global office name in layout if needed
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            alert("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        document.cookie = 'officePin=; path=/; max-age=0';
        setCurrentPin('');
        setView('auth');
        setAuthMode('login');
        setFormData({ officeName: '', email: '', officeTime: '', isOnline: true });
        router.refresh();
    };

    if (view === 'loading') return <div className="p-10 text-center">Loading...</div>;

    if (view === 'auth') {
        return (
            <DashboardLayout>
                <div className="max-w-md w-full mx-auto mt-10 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
                            office.
                        </h1>
                        <p className="text-gray-500">Manage your office workspace</p>
                    </div>

                    {/* Auth Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => { setAuthMode('login'); setGeneratedPin(null); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authMode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { setAuthMode('register'); setGeneratedPin(null); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authMode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Register
                        </button>
                    </div>

                    {authMode === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Office PIN</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter 6-digit PIN"
                                    value={authData.pin}
                                    onChange={e => setAuthData({ ...authData, pin: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Access Dashboard'}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {!generatedPin ? (
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Office Name</label>
                                        <input
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="e.g. Acme Studio"
                                            value={authData.name}
                                            onChange={e => setAuthData({ ...authData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="admin@example.com"
                                            value={authData.email}
                                            onChange={e => setAuthData({ ...authData, email: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Creating...' : 'Create Office'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Office Created!</h3>
                                    <p className="text-gray-500 mb-4">Your secret Login PIN is:</p>
                                    <div className="text-4xl font-mono font-bold text-blue-600 tracking-widest bg-blue-50 py-4 rounded-xl border border-blue-100 mb-6 select-all">
                                        {generatedPin}
                                    </div>
                                    <p className="text-xs text-red-500 mb-6">Please save this PIN immediately. You cannot recover it.</p>
                                    <button
                                        onClick={() => {
                                            setAuthData(prev => ({ ...prev, pin: generatedPin }));
                                            setAuthMode('login');
                                            setGeneratedPin(null);
                                        }}
                                        className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Go to Login
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DashboardLayout>
        );
    }

    // Settings View (Authenticated)
    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto mt-10 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                </div>

                {/* Office Configuration Form */}
                <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m8-2a2 2 0 100-4m0 4a2 2 0 100-4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4" />
                        </svg>
                        Office Profile
                    </h2>

                    <form onSubmit={handleSaveSettings} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Office Name</label>
                                <input
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.officeName}
                                    onChange={e => setFormData({ ...formData, officeName: e.target.value })}
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="contact@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Office Hours</label>
                            <input
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.officeTime}
                                onChange={e => setFormData({ ...formData, officeTime: e.target.value })}
                                placeholder="e.g. Mon-Fri, 9AM - 6PM"
                            />
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div>
                                <span className="block text-sm font-medium text-gray-900">Online Status</span>
                                <span className="text-xs text-gray-500">Show visible online indicator in dashboard</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.isOnline}
                                    onChange={e => setFormData({ ...formData, isOnline: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-70"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Sign Out</p>
                            <p className="text-sm text-gray-500">Office Pin: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{currentPin || '...'}</span></p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
