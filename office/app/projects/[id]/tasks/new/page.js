'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import TaskForm from '@/components/TaskForm';

export default function NewTaskPage() {
    const router = useRouter();
    const { id } = useParams(); // Project ID
    const [loading, setLoading] = useState(false);

    const handleCreate = async (formData) => {
        setLoading(true);
        try {
            const res = await fetch('/api/data');
            const data = await res.json();

            // Find project
            const projectIndex = data.projects.findIndex(p => p.id === id);
            if (projectIndex === -1) throw new Error("Project not found");

            const newTask = {
                id: `t${Date.now()}`,
                subtasks: [],
                notes: '',
                timeLogs: [],
                ...formData
            };

            // Add to root of project tasks for simplicity in this view
            // (If we supported adding subtasks via this page, we'd need a parentId param)
            data.projects[projectIndex].tasks.push(newTask);

            await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            router.push(`/projects/${id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                <Link href={`/projects/${id}`} className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6 inline-block">
                    ← Back to Project
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Task</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <TaskForm onSubmit={handleCreate} loading={loading} buttonText="Create Task" />
                </div>
            </div>
        </DashboardLayout>
    );
}
