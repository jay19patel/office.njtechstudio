'use client';

import { useState } from 'react';

const TaskItem = ({ task, depth = 0, users, onEdit, onAddSubtask }) => {
    const [expanded, setExpanded] = useState(false);
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;

    // Find assignee name
    const assignee = users?.find(u => u.id === task.assigneeId);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Done': return 'bg-green-100 text-green-700 border-green-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
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
                            <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {assignee && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                            <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full" />
                            <span className="hidden sm:inline">{assignee.name}</span>
                        </div>
                    )}
                    <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(task.status)}`}>
                        {task.status}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex gap-1 ml-2">
                        {onEdit && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                                className="p-1.5 rounded hover:bg-blue-100 text-blue-500 transition-colors"
                                title="Edit Task"
                            >
                                ✎
                            </button>
                        )}
                        {onAddSubtask && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onAddSubtask(task.id); }}
                                className="p-1.5 rounded hover:bg-green-100 text-green-500 transition-colors"
                                title="Add Subtask"
                            >
                                +
                            </button>
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
                            users={users}
                            onEdit={onEdit}
                            onAddSubtask={onAddSubtask}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function TaskTree({ tasks, users, onEdit, onAddSubtask }) {
    if (!tasks || tasks.length === 0) return <div className="text-gray-500 italic p-4 text-sm">No tasks found.</div>;

    return (
        <div className="space-y-2">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    users={users}
                    onEdit={onEdit}
                    onAddSubtask={onAddSubtask}
                />
            ))}
        </div>
    );
}
