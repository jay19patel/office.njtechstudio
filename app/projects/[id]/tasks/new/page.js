'use client';

import { useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import TaskForm from '@/components/TaskForm';

function NewTaskContent() {
    const router = useRouter();
    const { id } = useParams(); // Project ID
    const searchParams = useSearchParams();
    const parentId = searchParams.get('parentId');
    const typeParam = searchParams.get('type') || 'Task';

    const [loading, setLoading] = useState(false);

    const handleCreate = async (formData) => {
        setLoading(true);
        try {
            const newTask = {
                id: `t${Date.now()}`,
                subtasks: [],
                notes: '',
                timeLogs: [],
                ...formData,
                projectId: id,
                parentId: parentId || null
            };

            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create task");
            }

            router.push(`/projects/${id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link href={`/projects/${id}`} className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6 inline-block">
                ← Back to Project
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {parentId ? 'Create New Subtask' : 'Create New Task'}
            </h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <TaskForm
                    initialData={{ type: typeParam }}
                    onSubmit={handleCreate}
                    loading={loading}
                    buttonText="Create Task"
                />
            </div>
        </div>
    );
}

export default function NewTaskPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-10 text-gray-500">Loading form...</div>}>
                <NewTaskContent />
            </Suspense>
        </DashboardLayout>
    );
}
