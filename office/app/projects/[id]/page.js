'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TaskTree from '@/components/TaskTree';
import Link from 'next/link';
import Modal from '@/components/Modal';
import DashboardLayout from '@/components/DashboardLayout';

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeTask, setActiveTask] = useState(null); // Task being edited
    const [parentTaskId, setParentTaskId] = useState(null); // For adding subtask

    // Form States
    const [taskForm, setTaskForm] = useState({ title: '', status: 'Todo', type: 'Task', assigneeId: '', sprintId: '' });

    const fetchData = async () => {
        try {
            const res = await fetch('/api/data');
            if (res.ok) {
                const json = await res.json();
                setData(json);
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

    const handleUpdateData = async (newData) => {
        // Optimistic update
        setData(newData);
        try {
            await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
        } catch (err) {
            console.error("Failed to save", err);
            fetchData(); // partial revert
        }
    };

    const handleEditClick = (task) => {
        setActiveTask(task);
        setTaskForm({
            title: task.title,
            status: task.status,
            type: task.type,
            assigneeId: task.assigneeId || '',
            sprintId: task.sprintId || ''
        });
        setIsEditModalOpen(true);
    };

    const handleAddClick = (parentId = null) => {
        setParentTaskId(parentId);
        setTaskForm({ title: '', status: 'Todo', type: 'Task', assigneeId: '', sprintId: '' });
        setIsAddModalOpen(true);
    };

    const saveTask = () => {
        const newData = JSON.parse(JSON.stringify(data));
        const projectIndex = newData.projects.findIndex(p => p.id === id);
        if (projectIndex === -1) return;

        const updateTaskRecursive = (tasks) => {
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].id === activeTask.id) {
                    tasks[i] = { ...tasks[i], ...taskForm };
                    return true;
                }
                if (tasks[i].subtasks) {
                    if (updateTaskRecursive(tasks[i].subtasks)) return true;
                }
            }
            return false;
        };

        updateTaskRecursive(newData.projects[projectIndex].tasks);
        handleUpdateData(newData);
        setIsEditModalOpen(false);
    };

    const createTask = () => {
        const newData = JSON.parse(JSON.stringify(data));
        const projectIndex = newData.projects.findIndex(p => p.id === id);
        if (projectIndex === -1) return;

        const newTask = {
            id: `t${Date.now()}`,
            ...taskForm,
            subtasks: []
        };

        if (!parentTaskId) {
            // Add to root of project
            newData.projects[projectIndex].tasks.push(newTask);
        } else {
            // Add to specific task
            const addTaskRecursive = (tasks) => {
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].id === parentTaskId) {
                        if (!tasks[i].subtasks) tasks[i].subtasks = [];
                        tasks[i].subtasks.push(newTask);
                        return true;
                    }
                    if (tasks[i].subtasks && addTaskRecursive(tasks[i].subtasks)) return true;
                }
                return false;
            };
            addTaskRecursive(newData.projects[projectIndex].tasks);
        }

        handleUpdateData(newData);
        setIsAddModalOpen(false);
    };

    if (loading) return <DashboardLayout><div className="p-10 text-gray-500 animate-pulse">Loading Project...</div></DashboardLayout>;

    const project = data?.projects?.find(p => p.id === id);
    if (!project) return <DashboardLayout><div className="p-10 text-red-500">Project Not Found</div></DashboardLayout>;

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
                    <p className="text-gray-500 max-w-2xl">{project.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium 
                ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {project.status}
                    </span>
                    <span className="text-xs text-gray-400">Project ID: {project.id}</span>
                </div>
            </header>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-500 pl-3">Tasks & Hierarchy</h2>
                <button
                    onClick={() => handleAddClick(null)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm font-medium"
                >
                    + New Epic
                </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-inner">
                <TaskTree
                    tasks={project.tasks}
                    users={data.users}
                    onEdit={handleEditClick}
                    onAddSubtask={handleAddClick}
                />
            </div>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title</label>
                        <input
                            className="w-full bg-gray-700 rounded p-2 text-white"
                            value={taskForm.title}
                            onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Status</label>
                            <select
                                className="w-full bg-gray-700 rounded p-2 text-white"
                                value={taskForm.status}
                                onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}
                            >
                                <option>Todo</option>
                                <option>In Progress</option>
                                <option>Done</option>
                                <option>Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type</label>
                            <select
                                className="w-full bg-gray-700 rounded p-2 text-white"
                                value={taskForm.type}
                                onChange={e => setTaskForm({ ...taskForm, type: e.target.value })}
                            >
                                <option>Epic</option>
                                <option>Story</option>
                                <option>Task</option>
                                <option>Bug</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Assignee</label>
                        <select
                            className="w-full bg-gray-700 rounded p-2 text-white"
                            value={taskForm.assigneeId}
                            onChange={e => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
                        >
                            <option value="">Unassigned</option>
                            {data?.users?.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Sprint</label>
                        <select
                            className="w-full bg-gray-700 rounded p-2 text-white"
                            value={taskForm.sprintId}
                            onChange={e => setTaskForm({ ...taskForm, sprintId: e.target.value })}
                        >
                            <option value="">No Sprint</option>
                            {data?.sprints?.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.status})</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={saveTask}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded font-bold mt-4"
                    >
                        Save Changes
                    </button>
                </div>
            </Modal>

            {/* Add Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="New Task">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title</label>
                        <input
                            className="w-full bg-gray-700 rounded p-2 text-white"
                            value={taskForm.title}
                            onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                            placeholder="Task Title..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Status</label>
                            <input className="w-full bg-gray-700 rounded p-2 text-white" value="Todo" disabled />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type</label>
                            <select
                                className="w-full bg-gray-700 rounded p-2 text-white"
                                value={taskForm.type}
                                onChange={e => setTaskForm({ ...taskForm, type: e.target.value })}
                            >
                                <option>Task</option>
                                <option>Story</option>
                                <option>Bug</option>
                                <option>Epic</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Assignee</label>
                        <select
                            className="w-full bg-gray-700 rounded p-2 text-white"
                            value={taskForm.assigneeId}
                            onChange={e => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
                        >
                            <option value="">Unassigned</option>
                            {data?.users?.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={createTask}
                        className="w-full bg-green-600 hover:bg-green-500 text-white p-2 rounded font-bold mt-4"
                    >
                        Create Task
                    </button>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
