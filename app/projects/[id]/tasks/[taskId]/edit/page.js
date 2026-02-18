'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import TaskForm from '@/components/TaskForm';
import { useUpdateTask } from '@/hooks/useData';

export default function EditTaskPage() {
    const router = useRouter();
    const { id, taskId } = useParams();
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        // Fetch existing task data
        const loadTask = async () => {
            try {
                const res = await fetch(`/api/tasks/${taskId}`);
                if (!res.ok) throw new Error("Task not found");
                const task = await res.json();
                setInitialData(task);
            } catch (err) {
                console.error(err);
                router.push(`/projects/${id}`); // Redirect if not found
            }
        };
        if (taskId) loadTask();
    }, [id, taskId, router]);

    const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

    const handleUpdate = async (formData) => {
        setLoading(true);
        updateTask({ taskId, data: formData }, {
            onSuccess: () => {
                router.push(`/projects/${id}`);
                router.refresh(); // Ensure Next.js server components also refresh if any
            },
            onError: (error) => {
                console.error(error);
                alert("Failed to update task. Please try again.");
            },
            onSettled: () => {
                setLoading(false);
            }
        });
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
