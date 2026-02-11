'use client';

import { Suspense } from 'react';
import ProjectList from '@/components/ProjectList';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import StatusCard from '@/components/StatusCard';
import { useProjectData } from '@/utils/hooks';

function ProjectsContent() {
    const { data, isLoading, error } = useProjectData();
    const searchParams = useSearchParams();
    const router = useRouter();

    const statusFilter = searchParams.get('status') || 'All';
    const searchQuery = searchParams.get('q') || '';

    const updateParams = (updates) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== 'All') {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        router.push(`/projects?${params.toString()}`);
    };

    if (isLoading) return <div className="p-10 text-gray-500">Loading...</div>;

    if (error) {
        return <div className="p-10 text-red-500">Error loading data: {error.message}</div>;
    }

    const projects = data?.projects || [];
    const filteredProjects = projects.filter(p => {
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <>
            <Link href="/" className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6 inline-block">← Back to Dashboard</Link>

            <header className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
                    <Link
                        href="/projects/new"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm font-medium"
                    >
                        + New Project
                    </Link>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatusCard
                        label="Planning"
                        count={projects.filter(p => p.status === 'Planning').length}
                        type="purple"
                        subtext="Projects"
                        isActive={statusFilter === 'All' || statusFilter === 'Planning'}
                        onClick={() => updateParams({ status: statusFilter === 'Planning' ? 'All' : 'Planning' })}
                    />
                    <StatusCard
                        label="In Progress"
                        count={projects.filter(p => p.status === 'In Progress').length}
                        type="info"
                        subtext="Projects"
                        isActive={statusFilter === 'All' || statusFilter === 'In Progress'}
                        onClick={() => updateParams({ status: statusFilter === 'In Progress' ? 'All' : 'In Progress' })}
                    />
                    <StatusCard
                        label="On Hold"
                        count={projects.filter(p => p.status === 'On Hold').length}
                        type="warning"
                        subtext="Projects"
                        isActive={statusFilter === 'All' || statusFilter === 'On Hold'}
                        onClick={() => updateParams({ status: statusFilter === 'On Hold' ? 'All' : 'On Hold' })}
                    />
                    <StatusCard
                        label="Completed"
                        count={projects.filter(p => p.status === 'Completed').length}
                        type="success"
                        subtext="Projects"
                        isActive={statusFilter === 'All' || statusFilter === 'Completed'}
                        onClick={() => updateParams({ status: statusFilter === 'Completed' ? 'All' : 'Completed' })}
                    />
                </div>

                {/* Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => updateParams({ q: e.target.value })}
                    />
                </div>
            </header>

            {filteredProjects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    {projects.length === 0 ? (
                        <>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No Projects Yet</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Get started by creating your first project to organize tasks and sprints.</p>
                            <Link
                                href="/projects/new"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md font-medium inline-block"
                            >
                                + Create First Project
                            </Link>
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No Matching Projects</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
                            <button
                                onClick={() => updateParams({ q: '', status: 'All' })}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Clear Filters
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <ProjectList projects={filteredProjects} />
            )}
        </>
    );
}

export default function ProjectsPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-10 text-gray-500">Loading...</div>}>
                <ProjectsContent />
            </Suspense>
        </DashboardLayout>
    );
}
