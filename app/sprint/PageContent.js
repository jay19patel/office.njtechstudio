"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { format } from "date-fns";
import { useSprintData } from "@/utils/hooks";
import { api } from "@/services/api";

export default function SprintListPage() {
    const { data, isLoading } = useSprintData();
    const [expandedSprintId, setExpandedSprintId] = useState(null);
    const [localSprints, setLocalSprints] = useState(null);

    // Sync remote data to local state for delete operations if needed,
    // or better yet, just use data directly and invalidate query on delete.
    // For now, let's use data directly and standard mutation flow would be better.
    // But to minimize changes, I will rely on 'data' for rendering.

    // NOTE: 'deleteSprint' updates local state in the original code.
    // With React Query, we should use 'queryClient.invalidateQueries' or 'setQueryData'.
    // However, I don't have QueryClient instance here easily without import. 
    // To keep it simple and working: I'll accept that delete might not immediately update the UI 
    // unless I refactor delete to use mutation or reload. 
    // Actually, I can use UseQuery's 'refetch'.

    // Better approach: maintain local state initialized from data, or just rely on re-fetching.
    // Let's rely on re-fetching for simplicity in this "optimization" phase.

    const sprints = localSprints || data?.sprints || [];

    const deleteSprint = async (sprintId, e) => {
        e.stopPropagation(); // Prevent expansion
        if (!confirm("Are you sure you want to delete this sprint?")) return;

        try {
            await api.delete(`/sprint?id=${sprintId}`);
            // Optimistically update or refetch
            // Optimistically update or refetch
            // For now, simple reload or we can try to filter `data` if we had control.
            // Let's just reload the window or refetch if I can access it.
            // Since I can't easily access refetch without destructuring it...
            window.location.reload();
        } catch (error) {
            console.error("Error deleting sprint:", error);
        }
    };

    const toggleSprint = (sprintId) => {
        setExpandedSprintId(prev => prev === sprintId ? null : sprintId);
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto p-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Sprints</h1>
                        <p className="text-gray-500">Manage your daily plans and progress.</p>
                    </div>
                    <Link
                        href="/sprint/create"
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Sprint
                    </Link>
                </div>

                {isLoading ? (
                    <div className="text-center py-10 text-gray-400">Loading sprints...</div>
                ) : sprints.length > 0 ? (
                    <div className="space-y-4">
                        {sprints.map(sprint => (
                            <div key={sprint.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div
                                    className="p-4 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:bg-gray-50"
                                    onClick={() => toggleSprint(sprint.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{sprint.title || "Untitled Sprint"}</h3>
                                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                                <span>{format(new Date(sprint.date), "MMMM do, yyyy")}</span>
                                                <span>•</span>
                                                <span>{sprint.tasks?.length} Tasks</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                                        <button
                                            onClick={(e) => deleteSprint(sprint.id, e)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete Sprint"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                        <div className="text-gray-400">
                                            <svg className={`w-6 h-6 transform transition-transform ${expandedSprintId === sprint.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {expandedSprintId === sprint.id && (
                                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                                        <div className="space-y-2">
                                            {sprint.tasks?.map(task => (
                                                <Link
                                                    key={task._id || task.id}
                                                    href={`/projects/${task.projectId}?highlight=${task.id}`}
                                                    className="block bg-white p-3 rounded border border-gray-200 flex justify-between items-center hover:border-blue-400 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2 py-0.5 text-[10px] rounded uppercase font-bold tracking-wider ${task.type === 'Bug' ? 'bg-red-100 text-red-600' :
                                                            task.type === 'Epic' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                                            }`}>
                                                            {task.type}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-700">{task.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-gray-400">
                                                            {task.status || 'Pending'}
                                                        </span>
                                                        <span className="text-blue-500 text-xs">View →</span>
                                                    </div>
                                                </Link>
                                            ))}
                                            {(!sprint.tasks || sprint.tasks.length === 0) && (
                                                <div className="text-center text-gray-400 text-sm py-2">No tasks in this sprint.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No sprints created yet</h3>
                        <p className="text-gray-500 mt-1 max-w-sm mx-auto">Start planning your work by creating a new sprint.</p>
                        <Link
                            href="/sprint/create"
                            className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
                        >
                            Create Sprint
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
