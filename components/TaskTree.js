'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { isDelayed, calculateDuration } from '@/utils/timeUtils';

const TaskItem = ({ task, depth = 0, projectId, onEdit, onAddSubtask, highlightId }) => {
    // Recursive check for highlight
    const checkHighlight = (t) => {
        if (t.id === highlightId) return true;
        if (t.subtasks) return t.subtasks.some(checkHighlight);
        return false;
    };

    // Auto-expand if this task contains the highlighted task (recursively)
    const containsHighlight = task.subtasks && task.subtasks.some(checkHighlight);

    const [expanded, setExpanded] = useState(containsHighlight);

    // Sync expansion when highlightId changes
    useEffect(() => {
        if (containsHighlight) {
            setExpanded(true);
        }
    }, [highlightId, containsHighlight]);

    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const delayed = isDelayed(task.startDate, task.endDate, task.status);
    const duration = calculateDuration(task.startDate, task.endDate);

    const isHighlighted = task.id === highlightId;

    // Determine Project ID for linking
    // If task has projectId (flat list), use it. Otherwise use prop (heirarchical list)
    const activeProjectId = task.projectId || projectId;

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
            case 'Bug': return 'text-red-600 bg-red-50 px-1 rounded border border-red-200';
            default: return 'text-blue-600 bg-blue-50 px-1 rounded';
        }
    };

    return (
        <div className="mb-2 select-none" id={task.id}>
            <style jsx>{`
                @keyframes dash {
                    0% {
                        background-position: 0 0, 0 100%, 0 0, 100% 0;
                    }
                    100% {
                        background-position: 20px 0, -20px 100%, 0 -20px, 100% 20px;
                    }
                }
                .animate-dashed-border {
                    background-image: 
                        linear-gradient(90deg, #3b82f6 50%, transparent 50%), 
                        linear-gradient(90deg, #3b82f6 50%, transparent 50%), 
                        linear-gradient(0deg, #3b82f6 50%, transparent 50%), 
                        linear-gradient(0deg, #3b82f6 50%, transparent 50%);
                    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
                    background-size: 10px 1px, 10px 1px, 1px 10px, 1px 10px;
                    background-position: 0 0, 0 100%, 0 0, 100% 0;
                    animation: dash 1s linear infinite;
                }
                .animate-dashed-border-red {
                    background-image: 
                        linear-gradient(90deg, #ef4444 50%, transparent 50%), 
                        linear-gradient(90deg, #ef4444 50%, transparent 50%), 
                        linear-gradient(0deg, #ef4444 50%, transparent 50%), 
                        linear-gradient(0deg, #ef4444 50%, transparent 50%);
                    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
                    background-size: 10px 1px, 10px 1px, 1px 10px, 1px 10px;
                    background-position: 0 0, 0 100%, 0 0, 100% 0;
                    animation: dash 1s linear infinite;
                }
            `}</style>
            <div
                className={`
          flex items-center justify-between p-3 rounded-lg
          hover:bg-gray-50 transition-all border shadow-sm relative
          ${depth > 0 ? 'ml-6 border-l-4 border-l-gray-300' : ''}
          ${delayed ? 'animate-dashed-border-red bg-red-50 border-transparent' : (isHighlighted ? 'animate-dashed-border bg-blue-50 shadow-md border-transparent' : 'bg-white border-gray-100')}
        `}
                style={{ marginLeft: `${depth * 1.5}rem` }}
            >
                {delayed && (
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 z-10">
                        <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[8px] items-center justify-center font-bold">!</span>
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    {hasSubtasks ? (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="p-1 rounded hover:bg-gray-200 text-gray-400 transition-colors"
                        >
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ) : (
                        <div className="w-6"></div>
                    )}

                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${getTypeColor(task.type)}`}>
                                {task.type}
                            </span>
                            {activeProjectId ? (
                                <Link
                                    href={`/projects/${activeProjectId}/tasks/${task.id}/edit`} // Default to edit page on title click
                                    className="font-medium text-gray-900 text-sm hover:text-blue-600 hover:underline"
                                >
                                    {task.title}
                                </Link>
                            ) : (
                                <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                            )}
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

                    {/* Action Buttons */}
                    <div className="flex gap-1 ml-2">
                        {onEdit && (
                            <Link
                                href={`/projects/${activeProjectId}/tasks/${task.id}/edit`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded hover:bg-blue-100 text-blue-500 transition-colors"
                                title="Edit Task"
                            >
                                ✎
                            </Link>
                        )}
                        {onAddSubtask && activeProjectId && (
                            <Link
                                href={`/projects/${activeProjectId}/tasks/new?parentId=${task.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded hover:bg-green-100 text-green-500 transition-colors"
                                title="Add Subtask"
                            >
                                +
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Recursive Render */}
            {hasSubtasks && expanded && (
                <div className="mt-2 ml-4 pl-0">
                    {task.subtasks.map((subtask) => (
                        <TaskItem
                            key={subtask.id}
                            task={subtask}
                            depth={depth + 1}
                            projectId={activeProjectId}
                            onEdit={onEdit}
                            onAddSubtask={onAddSubtask}
                            highlightId={highlightId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function TaskTree({ tasks, projectId, onEdit, onAddSubtask, highlightId }) {
    if (!tasks || tasks.length === 0) return <div className="text-gray-500 italic p-4 text-sm">No tasks found.</div>;

    return (
        <div className="space-y-2">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    projectId={projectId}
                    onEdit={onEdit}
                    onAddSubtask={onAddSubtask}
                    highlightId={highlightId}
                />
            ))}
        </div>
    );
}
