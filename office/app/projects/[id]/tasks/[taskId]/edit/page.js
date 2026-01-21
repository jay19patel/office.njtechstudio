'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import TaskForm from '@/components/TaskForm';

export default function EditTaskPage() {
    const { id, taskId } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [task, setTask] = useState(null);
    const [fullData, setFullData] = useState(null);

    useEffect(() => {
        fetch('/api/data')
            .then(res => res.json())
            .then(json => {
                setFullData(json);
                // Find task
                const project = json.projects.find(p => p.id === id);
                if (project) {
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
                    const found = findTask(project.tasks);
                    if (found) setTask(found);
                }
                setLoading(false);
            });
    }, [id, taskId]);

    const handleUpdate = async (formData) => {
        setLoading(true);
        const newData = JSON.parse(JSON.stringify(fullData));
        const projectIndex = newData.projects.findIndex(p => p.id === id);

        const updateRecursive = (tasks) => {
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].id === taskId) {
                    // Merge existing task data with form data
                    tasks[i] = { ...tasks[i], ...formData };
                    return true;
                }
                if (tasks[i].subtasks && updateRecursive(tasks[i].subtasks)) return true;
            }
            return false;
        };

        if (projectIndex !== -1) {
            updateRecursive(newData.projects[projectIndex].tasks);

            await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });

            router.push(`/projects/${id}/tasks/${taskId}`);
        }
    };

    if (loading) return <DashboardLayout><div className="p-10 text-gray-500">Loading...</div></DashboardLayout>;
    if (!task) return <DashboardLayout><div className="p-10 text-red-500">Task Not Found</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                <Link href={`/projects/${id}/tasks/${taskId}`} className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6 inline-block">
                    ← Back to Task Details
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Task</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <TaskForm initialData={task} onSubmit={handleUpdate} loading={loading} buttonText="Save Changes" />
                </div>
            </div>
        </DashboardLayout>
    );
}
