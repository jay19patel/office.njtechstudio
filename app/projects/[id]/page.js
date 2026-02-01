'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import TaskTree from '@/components/TaskTree';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import ProgressBar from '@/components/ProgressBar';
import { calculateDuration } from '@/utils/timeUtils';

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const highlightId = searchParams.get('highlight');

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/data');
            if (res.ok) {
                const json = await res.json();
                setData(json);

                // Optional: Scroll to element once data is loaded and rendered
                if (highlightId) {
                    setTimeout(() => {
                        const el = document.getElementById(highlightId);
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 500); // Small delay to allow rendering
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <DashboardLayout><div className="p-10 text-gray-500 animate-pulse">Loading Project...</div></DashboardLayout>;

    const project = data?.projects?.find(p => p.id === id);
    if (!project) return <DashboardLayout><div className="p-10 text-red-500">Project Not Found</div></DashboardLayout>;

    // Calculate Duration
    const duration = calculateDuration(project.startDate, project.endDate);

    return (
        <DashboardLayout>
            <div className="mb-6">
                <Link href="/" className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
                    ← Back to Dashboard
                </Link>
            </div>

            <header className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                    <p className="text-gray-500 max-w-2xl text-lg mb-2">{project.description}</p>

                    {project.startDate && project.endDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                            {duration && <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium text-xs">{duration}</span>}
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2 items-center">
                        <Link
                            href={`/projects/${id}/edit`}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Edit
                        </Link>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium 
                    ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {project.status}
                        </span>
                    </div>
                    <div className="w-48">
                        <ProgressBar tasks={project.tasks} />
                    </div>
                </div>
            </header>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-500 pl-3">Tasks & Hierarchy</h2>
                <Link
                    href={`/projects/${id}/tasks/new?type=Epic`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm font-medium"
                >
                    + New Epic
                </Link>
            </div>

            <div className="">
                <TaskTree
                    tasks={project.tasks}
                    projectId={id}
                    onEdit={true}
                    onAddSubtask={true}
                    highlightId={highlightId}
                />
            </div>
        </DashboardLayout>
    );
}
