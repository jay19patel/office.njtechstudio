'use client';

import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import TaskTree from '@/components/TaskTree';
import { useAllTasks } from '@/hooks/useData';

export default function BugsPage() {
    const { data: projects, isLoading, error } = useAllTasks();

    if (isLoading) return <DashboardLayout><div className="p-10 text-gray-500">Loading...</div></DashboardLayout>;
    if (error) return <DashboardLayout><div className="p-10 text-red-500">Error loading bugs</div></DashboardLayout>;

    // Flatten bugs from all projects
    const getAllBugs = () => {
        if (!projects) return [];

        const bugs = [];
        const traverse = (tasks, projectTitle, projectId) => {
            tasks.forEach(task => {
                if (task.type === 'Bug') {
                    // Add project context if needed, or just list them. 
                    // For TaskTree reuse, we must keep structure compatible.
                    // But TaskTree is hierarchical. If we flatten, we lose hierarchy.
                    // Let's just create a flat list of bugs, but use TaskTree to render them individually.
                    bugs.push({ ...task, projectTitle, projectId });
                }
                if (task.subtasks) traverse(task.subtasks, projectTitle, projectId);
            });
        };

        projects.forEach(p => traverse(p.tasks, p.title, p.id));
        return bugs;
    };

    const bugs = getAllBugs();

    return (
        <DashboardLayout>
            <Link href="/" className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6 inline-block">← Back to Dashboard</Link>

            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Bug Tracker
                    </h1>
                    <p className="text-gray-500 mt-1">Found {bugs.length} reported bugs across all projects.</p>
                </div>
            </header>

            {bugs.length === 0 ? (
                <div className="p-10 bg-green-50 text-green-700 rounded-xl border border-green-200 text-center">
                    No bugs found! Great job.
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {bugs.map(bug => (
                        <div key={bug.id} className="border-b border-gray-100 last:border-0 p-4 hover:bg-red-50/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Project: {bug.projectTitle}
                                </span>
                                <Link href={`/projects/${bug.projectId}`} className="text-blue-500 text-xs hover:underline">
                                    View Context →
                                </Link>
                            </div>
                            {/* Render using TaskTree for consistency, passing single item array */}
                            <TaskTree tasks={[bug]} users={data.users || []} />
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
