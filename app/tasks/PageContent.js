'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import StatusCard from '@/components/StatusCard';
import { useProjectData } from '@/utils/hooks';
import { isDelayed, calculateDuration } from '@/utils/timeUtils';

function TasksContent() {
    const { data, isLoading: loading } = useProjectData();

    const router = useRouter();
    const searchParams = useSearchParams();

    // Filters from URL
    const view = searchParams.get('view') || 'tasks';
    const filterType = searchParams.get('type') || 'All';
    const filterStatus = searchParams.get('status') || 'All';
    const filterProject = searchParams.get('project') || 'All';
    const searchQuery = searchParams.get('q') || '';
    const isCritical = searchParams.get('critical') === 'true';


    const updateParams = (updates) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== 'All' && value !== false) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        router.push(`/tasks?${params.toString()}`);
    };

    if (loading) return <div className="p-10 text-gray-500">Loading...</div>;

    // 1. Flatten ALL tasks & Build Breadcrumbs
    const getAllTasks = () => {
        const flattened = [];
        const taskLookup = {};

        // Helper to build lookup
        const buildLookup = (taskList) => {
            taskList.forEach(task => {
                taskLookup[task.id] = task;
                if (task.subtasks) buildLookup(task.subtasks);
            });
        };

        if (data && data.projects) {
            data.projects.forEach(p => buildLookup(p.tasks));
        }

        const traverse = (taskList, projectTitle, projectId) => {
            taskList.forEach(task => {
                let breadcrumb = projectTitle;
                if (task.parentId) {
                    const parent = taskLookup[task.parentId];
                    if (parent && parent.type === 'Epic') {
                        breadcrumb += ` / ${parent.title}`;
                    }
                }
                flattened.push({ ...task, projectTitle, projectId, breadcrumb });
                if (task.subtasks) traverse(task.subtasks, projectTitle, projectId);
            });
        };

        if (data && data.projects) {
            data.projects.forEach(p => traverse(p.tasks, p.title, p.id));
        }
        return flattened;
    };

    const allTasks = getAllTasks();

    // 2. Filter (Exclude Epics + Apply standard filters)
    const filteredTasks = allTasks.filter(task => {
        // Toggle Logic: View === 'epic' ? Show Epics Only : Show Everything Else (exclude Epics)
        if (view === 'epic') {
            if (task.type !== 'Epic') return false;
        } else {
            if (task.type === 'Epic') return false;
        }

        const matchType = filterType === 'All' || task.type === filterType;
        const matchStatus = filterStatus === 'All' || task.status === filterStatus;
        const matchProject = filterProject === 'All' || task.projectId === filterProject;
        const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const delayed = isDelayed(task.startDate, task.endDate, task.status);
        const matchCritical = !isCritical || delayed;

        return matchType && matchStatus && matchProject && matchSearch && matchCritical;
    });

    // 3. Stats (Dynamic based on View)
    const statsItems = view === 'epic'
        ? allTasks.filter(t => t.type === 'Epic')
        : allTasks.filter(t => t.type !== 'Epic');

    const counts = {
        pending: statsItems.filter(t => t.status === 'Pending').length,
        inProgress: statsItems.filter(t => t.status === 'In Progress').length,
        brainstorming: statsItems.filter(t => t.status === 'Brainstorming').length,
        completed: statsItems.filter(t => t.status === 'Completed').length,
        critical: statsItems.filter(t => isDelayed(t.startDate, t.endDate, t.status)).length
    };

    // Helper functions for styling (matching defaults)
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Brainstorming': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Epic': return 'text-purple-600 bg-purple-50 px-1 rounded';
            case 'Story': return 'text-orange-600 bg-orange-50 px-1 rounded';
            case 'Bug': return 'text-red-600 bg-red-50 px-1 rounded border border-red-200';
            default: return 'text-blue-600 bg-blue-50 px-1 rounded';
        }
    };

    return (
        <>
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

                    {/* View Toggle */}
                    <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                        <button
                            onClick={() => updateParams({ view: 'tasks' })}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view !== 'epic' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Tasks
                        </button>
                        <button
                            onClick={() => updateParams({ view: 'epic' })}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'epic' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Epics
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatusCard label="Pending" count={counts.pending} type="warning" subtext={view === 'epic' ? 'Epics' : 'Tasks'} isActive={!isCritical && (filterStatus === 'All' || filterStatus === 'Pending')} onClick={() => updateParams({ status: filterStatus === 'Pending' ? 'All' : 'Pending', critical: false })} />
                    <StatusCard label="In Progress" count={counts.inProgress} type="info" subtext={view === 'epic' ? 'Epics' : 'Tasks'} isActive={!isCritical && (filterStatus === 'All' || filterStatus === 'In Progress')} onClick={() => updateParams({ status: filterStatus === 'In Progress' ? 'All' : 'In Progress', critical: false })} />
                    <StatusCard label="Brainstorming" count={counts.brainstorming} type="purple" subtext={view === 'epic' ? 'Epics' : 'Tasks'} isActive={!isCritical && (filterStatus === 'All' || filterStatus === 'Brainstorming')} onClick={() => updateParams({ status: filterStatus === 'Brainstorming' ? 'All' : 'Brainstorming', critical: false })} />
                    <StatusCard label="Completed" count={counts.completed} type="success" subtext={view === 'epic' ? 'Epics' : 'Tasks'} isActive={!isCritical && (filterStatus === 'All' || filterStatus === 'Completed')} onClick={() => updateParams({ status: filterStatus === 'Completed' ? 'All' : 'Completed', critical: false })} />
                    <StatusCard label="Critical" count={counts.critical} type="red" subtext="Alerts" isActive={isCritical || (filterStatus === 'All' && !isCritical)} onClick={() => updateParams({ critical: isCritical ? false : 'true', status: 'All' })} />
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg pl-4 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Search tasks..." value={searchQuery} onChange={(e) => updateParams({ q: e.target.value })} />
                </div>
                <div className="flex gap-4 flex-wrap">
                    {view !== 'epic' && (
                        <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none" value={filterType} onChange={(e) => updateParams({ type: e.target.value })}>
                            <option value="All">All Types</option>
                            <option value="Task">Task</option>
                            <option value="Bug">Bug</option>
                        </select>
                    )}
                    <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none" value={filterStatus} onChange={(e) => updateParams({ status: e.target.value })}>
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Brainstorming">Brainstorming</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none" value={filterProject} onChange={(e) => updateParams({ project: e.target.value })}>
                        <option value="All">All Projects</option>
                        {data?.projects?.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="p-10 bg-gray-50 text-gray-500 rounded-xl border border-gray-200 text-center">No tasks found.</div>
            ) : (
                <div>
                    {filteredTasks.map(task => {
                        const delayed = isDelayed(task.startDate, task.endDate, task.status);
                        const duration = calculateDuration(task.startDate, task.endDate);

                        return (
                            <div key={task.id} className="border-b border-gray-100 last:border-0 p-4 hover:bg-blue-50/10 transition-colors">
                                {/* Header: Project Context */}
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Project: {task.projectTitle}
                                        {task.breadcrumb.replace(task.projectTitle, '') && (
                                            <span className="text-purple-500 ml-1">{task.breadcrumb.replace(task.projectTitle, '')}</span>
                                        )}
                                    </span>
                                    <Link href={`/projects/${task.projectId}`} className="text-blue-500 text-xs hover:underline">
                                        View Context →
                                    </Link>
                                </div>

                                {/* Task Card (Clickable via Link wrapper for entire card) */}
                                {/* Replicating TaskItem Visuals */}
                                <Link
                                    href={`/projects/${task.projectId}?highlight=${task.id}`}
                                    className="block relative group"
                                >
                                    <div className={`
                                        flex items-center justify-between p-3 rounded-lg
                                        bg-white hover:bg-gray-50 transition-colors border shadow-sm
                                        ${delayed ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-100 group-hover:border-blue-300'}
                                    `}>
                                        {delayed && (
                                            <div className="absolute top-0 right-0 -mr-2 -mt-2 z-10">
                                                <span className="relative flex h-4 w-4">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[8px] items-center justify-center font-bold">!</span>
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            {/* Spacer imitating the collapse button width for consistency if needed, or just plain */}
                                            <div className="w-1 bg-transparent"></div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${getTypeColor(task.type)}`}>
                                                        {task.type}
                                                    </span>
                                                    <h4 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                                                        {task.title}
                                                    </h4>
                                                </div>
                                                {task.startDate && task.endDate && (
                                                    <div className="text-[10px] text-gray-400 mt-0.5 ml-1 flex gap-2">
                                                        <span>{new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}</span>
                                                        {duration && <span className="font-medium text-gray-500">({duration})</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                            {/* We can hide action buttons in this view to keep it clean, or show Edit icon */}
                                            {/* User wants "click pe vo task projects me khul ke" -> whole card clickable. */}
                                            {/* So explicitly no internal buttons that might block propagation, or handle them carefully */}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}

export default function TasksPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-10 text-gray-500">Loading tasks...</div>}>
                <TasksContent />
            </Suspense>
        </DashboardLayout>
    );
}
