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

            if (parentId) {
                // Add as subtask
                const addTaskRecursive = (tasks) => {
                    for (let i = 0; i < tasks.length; i++) {
                        if (tasks[i].id === parentId) {
                            if (!tasks[i].subtasks) tasks[i].subtasks = [];
                            tasks[i].subtasks.push(newTask);
                            return true;
                        }
                        if (tasks[i].subtasks && addTaskRecursive(tasks[i].subtasks)) return true;
                    }
                    return false;
                };

                const found = addTaskRecursive(data.projects[projectIndex].tasks);
                if (!found) {
                    console.error("Parent task not found, adding to root");
                    data.projects[projectIndex].tasks.push(newTask);
                }
            } else {
                // Add to root
                data.projects[projectIndex].tasks.push(newTask);
            }

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
