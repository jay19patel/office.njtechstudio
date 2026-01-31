'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function SettingsPage() {
    const [currentPin, setCurrentPin] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Read cookie
        const match = document.cookie.match(new RegExp('(^| )officePin=([^;]+)'));
        if (match) {
            setCurrentPin(match[2]);
        }
    }, []);

    const handleLogout = () => {
        document.cookie = 'officePin=; path=/; max-age=0';
        router.push('/login');
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto mt-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Office Identification</h2>
                    <div className="mb-6">
                        <p className="text-gray-600 mb-2">Current Office Pin:</p>
                        <div className="text-2xl font-mono bg-gray-100 p-3 rounded inline-block">
                            {currentPin || 'Not Set'}
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <p className="text-gray-600 mb-4">
                            To switch offices, you clearly need to "logout" and enter a new pin.
                        </p>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                        >
                            Change Office Pin (Logout)
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
