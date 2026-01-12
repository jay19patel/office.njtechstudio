'use client';

import { useState, useEffect } from 'react';
import UserList from '@/components/UserList';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function UsersPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/data')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            });
    }, []);

    if (loading) return <DashboardLayout><div className="p-10 text-gray-500">Loading...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <Link href="/" className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6 inline-block">← Back to Dashboard</Link>
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm font-medium">
                    + Add User
                </button>
            </header>

            <UserList users={data.users} projects={data.projects} />
        </DashboardLayout>
    );
}
