'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import AiGenerator from '@/components/AiGenerator';

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Planning'
    });
    const [tasks, setTasks] = useState([]);
    const handleAiFill = (template) => {
        setFormData(prev => ({
            ...prev,
            title: template.title,
            description: template.description,
            status: template.status || prev.status,
            startDate: template.startDate,
            endDate: template.endDate
        }));

        // Regenerate IDs to avoid collisions if used multiple times
        const regenerateIds = (items) => {
            return items.map(item => ({
                ...item,
                id: `t${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                subtasks: item.subtasks ? regenerateIds(item.subtasks) : []
            }));
        };

        if (template.tasks) {
            setTasks(regenerateIds(template.tasks));
        }
    };


    // --- Task Management Logic ---
    const addTask = (parentId = null) => {
        const newTask = {
            id: `t${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: '',
            type: 'Task',
            status: 'To Do',
            subtasks: []
        };

        if (parentId === null) {
            setTasks([...tasks, newTask]);
        } else {
            const addSubtaskRecursive = (items) => {
                return items.map(item => {
                    if (item.id === parentId) {
                        return { ...item, subtasks: [...(item.subtasks || []), newTask] };
                    }
                    if (item.subtasks && item.subtasks.length > 0) {
                        return { ...item, subtasks: addSubtaskRecursive(item.subtasks) };
                    }
                    return item;
                });
            };
            setTasks(addSubtaskRecursive(tasks));
        }
    };

    const updateTask = (id, updates) => {
        const updateRecursive = (items) => {
            return items.map(item => {
                if (item.id === id) {
                    return { ...item, ...updates };
                }
                if (item.subtasks && item.subtasks.length > 0) {
                    return { ...item, subtasks: updateRecursive(item.subtasks) };
                }
                return item;
            });
        };
        setTasks(updateRecursive(tasks));
    };

    const deleteTask = (id) => {
        const deleteRecursive = (items) => {
            return items
                .filter(item => item.id !== id)
                .map(item => {
                    if (item.subtasks && item.subtasks.length > 0) {
                        return { ...item, subtasks: deleteRecursive(item.subtasks) };
                    }
                    return item;
                });
        };
        setTasks(deleteRecursive(tasks));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newProject = {
                ...formData,
                tasks: tasks
            };

            const saveRes = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject)
            });

            if (saveRes.status === 401) {
                alert("Session expired. Please login again.");
                router.push('/login');
                return;
            }

            if (!saveRes.ok) {
                throw new Error("Failed to save project");
            }

            router.push('/projects');
        } catch (error) {
            console.error('Failed to create project', error);
            alert("An error occurred while creating the project. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <Link href="/projects" className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6 inline-block">
                    ← Back to Projects
                </Link>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
                </div>

                <AiGenerator onGenerate={handleAiFill} type="project" />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Project Details */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Project Details</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                                <input
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Q1 Marketing Campaign"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Briefly describe the goals and scope..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option>Planning</option>
                                    <option>In Progress</option>
                                    <option>On Hold</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                        </div>

                        {/* Task Builder */}
                        <div className="space-y-4 pt-6 border-t">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">Task Builder</h2>
                                <button
                                    type="button"
                                    onClick={() => addTask(null)}
                                    className="text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded-full hover:bg-green-100 font-medium transition-colors"
                                >
                                    + Add Top Level Item
                                </button>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 min-h-[100px] space-y-2">
                                {tasks.length === 0 ? (
                                    <div className="text-center text-gray-400 py-8">
                                        No tasks added yet. Start by adding an Epic or Task.
                                    </div>
                                ) : (
                                    tasks.map(task => (
                                        <TaskItem
                                            key={task.id}
                                            task={task}
                                            onUpdate={updateTask}
                                            onDelete={deleteTask}
                                            onAddSubtask={addTask}
                                            depth={0}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Project...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout >
    );
}

function TaskItem({ task, onUpdate, onDelete, onAddSubtask, depth = 0 }) {
    const getTypeColor = (type) => {
        switch (type) {
            case 'Epic': return 'text-purple-600 bg-purple-50 px-1 rounded';
            case 'Story': return 'text-orange-600 bg-orange-50 px-1 rounded';
            case 'Bug': return 'text-red-600 bg-red-50 px-1 rounded border border-red-200';
            default: return 'text-blue-600 bg-blue-50 px-1 rounded';
        }
    };

    return (
        <div className="mb-2">
            <div
                className={`flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all
                  ${depth > 0 ? 'ml-6 border-l-4 border-l-gray-300' : ''}`}
                style={{ marginLeft: `${depth * 1.5}rem` }}
            >
                {/* Type Selector (styled like a badge) */}
                <select
                    className={`text-[10px] font-bold uppercase tracking-wider border-none focus:ring-0 cursor-pointer ${getTypeColor(task.type)}`}
                    value={task.type}
                    onChange={(e) => onUpdate(task.id, { type: e.target.value })}
                >
                    <option>Epic</option>
                    <option>Story</option>
                    <option>Task</option>
                    <option>Bug</option>
                </select>

                {/* Title Input */}
                <input
                    className="flex-1 font-medium text-gray-900 text-sm border-b border-transparent hover:border-gray-200 focus:border-blue-500 outline-none px-1 py-0.5 placeholder-gray-400"
                    placeholder="Task Title..."
                    value={task.title}
                    onChange={(e) => onUpdate(task.id, { title: e.target.value })}
                />

                {/* Actions */}
                <div className="flex gap-1 ml-2 opacity-60 hover:opacity-100 transition-opacity">
                    <button
                        type="button"
                        onClick={() => onAddSubtask(task.id)}
                        className="p-1.5 rounded hover:bg-green-100 text-green-500 transition-colors"
                        title="Add Subtask"
                    >
                        +
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(task.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Subtasks Container */}
            {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-2">
                    {task.subtasks.map(sub => (
                        <TaskItem
                            key={sub.id}
                            task={sub}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            onAddSubtask={onAddSubtask}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
