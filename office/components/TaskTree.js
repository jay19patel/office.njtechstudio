'use client';

import { useState } from 'react';

const TaskItem = ({ task, depth = 0, projectId, onEdit, onAddSubtask }) => {
    const [expanded, setExpanded] = useState(false);
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;

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
            case 'Story': return 'text-orange-600 bg-orange-50 px-1 rounded';
            case 'Bug': return 'text-red-600 bg-red-50 px-1 rounded border border-red-200';
            default: return 'text-blue-600 bg-blue-50 px-1 rounded';
        }
    };

    return (
        <div className="mb-2 select-none">
            <div
                className={`
          flex items-center justify-between p-3 rounded-lg
          bg-white hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm
          ${depth > 0 ? 'ml-6 border-l-4 border-l-gray-300' : ''}
        `}
                style={{ marginLeft: `${depth * 1.5}rem` }}
            >
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
                                    href={`/projects/${activeProjectId}/tasks/${task.id}`}
                                    className="font-medium text-gray-900 text-sm hover:text-blue-600 hover:underline"
                                >
                                    {task.title}
                                </Link>
                            ) : (
                                <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                            )}
                        </div>
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
                                href={`/projects/${activeProjectId}/tasks/new`} // Simplified: Redirect to new task page, though ideally we'd pass parentId. For now just generic new task.
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded hover:bg-green-100 text-green-500 transition-colors"
                                title="Add Subtask (Note: Adds to root currently)"
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

import Link from 'next/link';

export default function TaskTree({ tasks, projectId, onEdit, onAddSubtask }) {
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
                />
            ))}
        </div>
    );
}
