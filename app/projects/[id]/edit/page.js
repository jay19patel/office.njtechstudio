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
                const res = await fetch(`/api/projects/${id}`);
                if (!res.ok) throw new Error("Project not found");
                const project = await res.json();
                setInitialData(project);
            } catch (err) {
                console.error(err);
                router.push('/projects'); // Redirect if not found
            }
        };
        if (id) loadProject();
    }, [id, router]);

    const handleUpdate = async (formData) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to update project");

            router.push(`/projects/${id}`);
        } catch (error) {
            console.error(error);
            alert("Failed to update project. Please try again.");
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
