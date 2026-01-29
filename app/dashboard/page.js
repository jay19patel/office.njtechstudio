'use client';

import { useState, useEffect } from 'react';
import DashboardStats from '@/components/DashboardStats';
import ProjectList from '@/components/ProjectList';
import Link from 'next/link';

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/data');
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Calculate stats
    // Recursive function to count tasks
    const countTasks = (tasks = []) => {
        let count = 0;
        let openCount = 0;
        tasks.forEach(task => {
            count++;
            if (task.status !== 'Done' && task.status !== 'Completed') {
                openCount++;
            }
            if (task.subtasks) {
                const { total, open } = countTasks(task.subtasks);
                count += total;
                openCount += open;
            }
        });
        return { total: count, open: openCount };
    };

    let totalTasks = 0;
    let openTasks = 0;

    if (data?.projects) {
        data.projects.forEach(p => {
            const { total, open } = countTasks(p.tasks);
            totalTasks += total;
            openTasks += open;
        });
    }

    const stats = {
        totalUsers: data?.users?.length || 0,
        totalProjects: data?.projects?.length || 0,
        totalTasks,
        openTasks
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Symphony Dashboard
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your projects, sprints, and tasks efficiently.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/users" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        Manage Users
                    </Link>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg shadow-blue-500/30">
                        + New Project
                    </button>
                </div>
            </header>

            <section>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Overview
                </h2>
                <DashboardStats stats={stats} />
            </section>

            <section className="mt-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                        Recent Projects
                    </h2>
                    <Link href="/projects" className="text-blue-400 hover:text-blue-300 text-sm">View All</Link>
                </div>
                <ProjectList projects={data?.projects} />
            </section>
        </div>
    );
}
