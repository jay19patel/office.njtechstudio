'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import ProjectForm from '@/components/ProjectForm';

export default function EditProjectPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        // Fetch existing project data
        const loadProject = async () => {
            try {
                const res = await fetch('/api/data');
                const data = await res.json();
                const project = data.projects.find(p => p.id === id);
                if (project) setInitialData(project);
            } catch (err) {
                console.error(err);
            }
        };
        loadProject();
    }, [id]);

    const handleUpdate = async (formData) => {
        setLoading(true);
        try {
            const res = await fetch('/api/data');
            const data = await res.json();
            const projectIndex = data.projects.findIndex(p => p.id === id);

            if (projectIndex !== -1) {
                // Preserve tasks when updating
                data.projects[projectIndex] = {
                    ...data.projects[projectIndex],
                    ...formData,
                    tasks: data.projects[projectIndex].tasks // Ensure tasks aren't overwritten by form
                };

                await fetch('/api/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                router.push(`/projects/${id}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!initialData) return <DashboardLayout><div className="p-10">Loading Project...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                <Link href={`/projects/${id}`} className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6 inline-block">
                    ← Back to Project
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Project</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <ProjectForm
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
