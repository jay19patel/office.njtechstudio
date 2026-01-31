"use client";

import { useState, useEffect } from 'react';

export default function Header() {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error("Failed to load header settings", error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
            {/* Left: Search or Breadcrumbs */}
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                {settings && (
                    <div className="hidden md:flex flex-col border-l border-gray-200 pl-4 ml-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700">{settings.officeName || 'My Office'}</span>
                            {settings.isOnline && (
                                <span className="w-2 h-2 rounded-full bg-green-500" title="Online"></span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                            {settings.email && <span>{settings.email}</span>}
                            {settings.officeTime && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span>{settings.officeTime}</span>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>


            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition-colors relative">
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>

                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
        </header >
    );
}
