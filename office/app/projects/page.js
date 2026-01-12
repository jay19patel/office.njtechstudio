'use client';

import { useState, useEffect } from 'react';
import ProjectList from '@/components/ProjectList';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function ProjectsPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/api/data').then(r => r.json()).then(setData);
    }, []);

    if (!data) return <DashboardLayout><div className="p-10 text-gray-500">Loading...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <Link href="/" className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6 inline-block">← Back to Dashboard</Link>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
                {/* Add Project Button could go here */}
            </div>

            <ProjectList projects={data.projects} />
        </DashboardLayout>
    );
}
