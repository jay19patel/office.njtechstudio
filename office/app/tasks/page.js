'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import TaskTree from '@/components/TaskTree';
import StatusCard from '@/components/StatusCard';

export default function TasksPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterProject, setFilterProject] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/data')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            });
    }, []);

    if (loading) return <DashboardLayout><div className="p-10 text-gray-500">Loading...</div></DashboardLayout>;

    // Flatten tasks from all projects
    const getAllTasks = () => {
        const tasks = [];
        const traverse = (taskList, projectTitle, projectId) => {
            taskList.forEach(task => {
                // Apply Filters
                const matchType = filterType === 'All' || task.type === filterType;
                const matchStatus = filterStatus === 'All' || task.status === filterStatus;
                const matchProject = filterProject === 'All' || projectId === filterProject;
                const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());

                if (matchType && matchStatus && matchProject && matchSearch) {
                    tasks.push({ ...task, projectTitle, projectId });
                }

                if (task.subtasks) traverse(task.subtasks, projectTitle, projectId);
            });
        };

        if (data && data.projects) {
            data.projects.forEach(p => traverse(p.tasks, p.title, p.id));
        }
        return tasks;
    };

    const tasks = getAllTasks();

    return (
        <DashboardLayout>
            <Link href="/" className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6 inline-block">← Back to Dashboard</Link>

            <header className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            All Tasks
                        </h1>
                        <p className="text-gray-500 mt-1">Manage and track all work items across projects.</p>
                    </div>
                </div>

                {/* Status Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatusCard
                        label="Pending"
                        count={tasks.filter(t => t.status === 'Pending').length}
                        type="warning"
                        subtext="Tasks"
                        isActive={filterStatus === 'All' || filterStatus === 'Pending'}
                        onClick={() => setFilterStatus(filterStatus === 'Pending' ? 'All' : 'Pending')}
                    />
                    <StatusCard
                        label="In Progress"
                        count={tasks.filter(t => t.status === 'In Progress').length}
                        type="info"
                        subtext="Tasks"
                        isActive={filterStatus === 'All' || filterStatus === 'In Progress'}
                        onClick={() => setFilterStatus(filterStatus === 'In Progress' ? 'All' : 'In Progress')}
                    />
                    <StatusCard
                        label="Brainstorming"
                        count={tasks.filter(t => t.status === 'Brainstorming').length}
                        type="purple"
                        subtext="Tasks"
                        isActive={filterStatus === 'All' || filterStatus === 'Brainstorming'}
                        onClick={() => setFilterStatus(filterStatus === 'Brainstorming' ? 'All' : 'Brainstorming')}
                    />
                    <StatusCard
                        label="Completed"
                        count={tasks.filter(t => t.status === 'Completed').length}
                        type="success"
                        subtext="Tasks"
                        isActive={filterStatus === 'All' || filterStatus === 'Completed'}
                        onClick={() => setFilterStatus(filterStatus === 'Completed' ? 'All' : 'Completed')}
                    />
                </div>
            </header>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <select
                        className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Epic">Epic</option>
                        <option value="Story">Story</option>
                        <option value="Task">Task</option>
                        <option value="Bug">Bug</option>
                    </select>

                    <select
                        className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Brainstorming">Brainstorming</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <select
                        className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterProject}
                        onChange={(e) => setFilterProject(e.target.value)}
                    >
                        <option value="All">All Projects</option>
                        {data?.projects?.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="p-10 bg-gray-50 text-gray-500 rounded-xl border border-gray-200 text-center">
                    No tasks found matching your filters.
                </div>
            ) : (
                <div className="">
                    {tasks.map(task => (
                        <div key={task.id} className="border-b border-gray-100 last:border-0 p-4 hover:bg-blue-50/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Project: {task.projectTitle}
                                </span>
                                <Link href={`/projects/${task.projectId}`} className="text-blue-500 text-xs hover:underline">
                                    View Context →
                                </Link>
                            </div>
                            <TaskTree tasks={[task]} onEdit={null} onAddSubtask={null} />
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
