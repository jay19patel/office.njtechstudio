'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function SettingsPage() {
    // Default config email or load from local storage/api in future
    const [email, setEmail] = useState('jay@njtech.studio');
    const [saved, setSaved] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        // Here you would save to backend
        console.log("Saving configuration:", { email });

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <DashboardLayout>
            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-500 mb-8">Manage your workspace configuration.</p>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Configuration Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">This email will be used for system notifications and configuration.</p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Save Changes
                            </button>
                        </div>

                        {saved && (
                            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-center text-sm font-medium animate-fadeIn">
                                Configuration saved successfully!
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
