'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import TaskForm from '@/components/TaskForm';

export default function EditTaskPage() {
    const router = useRouter();
    const { id, taskId } = useParams();
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        // Fetch existing task data
        const loadTask = async () => {
            try {
                const res = await fetch('/api/data');
                const data = await res.json();
                const project = data.projects.find(p => p.id === id);
                if (!project) return;

                const findTask = (tasks) => {
                    for (const t of tasks) {
                        if (t.id === taskId) return t;
                        if (t.subtasks) {
                            const found = findTask(t.subtasks);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const task = findTask(project.tasks);
                if (task) setInitialData(task);
            } catch (err) {
                console.error(err);
            }
        };
        loadTask();
    }, [id, taskId]);

    const handleUpdate = async (formData) => {
        setLoading(true);
        try {
            const res = await fetch('/api/data');
            const data = await res.json();
            const projectIndex = data.projects.findIndex(p => p.id === id);

            const updateTaskRecursive = (tasks) => {
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].id === taskId) {
                        tasks[i] = { ...tasks[i], ...formData };
                        return true;
                    }
                    if (tasks[i].subtasks) {
                        if (updateTaskRecursive(tasks[i].subtasks)) return true;
                    }
                }
                return false;
            };

            updateTaskRecursive(data.projects[projectIndex].tasks);

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

    if (!initialData) return <DashboardLayout><div className="p-10">Loading Task...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                <Link href={`/projects/${id}`} className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6 inline-block">
                    ← Back to Project
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Task</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <TaskForm
                        initialData={initialData}
                        onSubmit={handleUpdate}
                        loading={loading}
                        buttonText="Save Changes"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
