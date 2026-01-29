'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function TaskDetailPage() {
    const { id, taskId } = useParams();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isNotesEditing, setIsNotesEditing] = useState(false);
    const [notesBuffer, setNotesBuffer] = useState('');

    useEffect(() => {
        fetch('/api/data')
            .then(res => res.json())
            .then(json => {
                setData(json);
                // Find task
                const findTask = (tasks) => {
                    for (const t of tasks) {
                        if (t.id === taskId) return t;
                        if (t.subtasks) {
                            const found = findTask(t.subtasks);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const project = json.projects.find(p => p.id === id);
                if (project) {
                    const found = findTask(project.tasks);
                    if (found) {
                        setTask(found);
                        setNotesBuffer(found.notes || '');
                    }
                }
                setLoading(false);
            });
    }, [id, taskId]);

    const saveUpdates = async (updatedTask) => {
        if (!data || !updatedTask) return;

        const newData = JSON.parse(JSON.stringify(data));
        const projectIndex = newData.projects.findIndex(p => p.id === id);

        const updateRecursive = (tasks) => {
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].id === updatedTask.id) {
                    tasks[i] = updatedTask;
                    return true;
                }
                if (tasks[i].subtasks && updateRecursive(tasks[i].subtasks)) return true;
            }
            return false;
        };

        if (projectIndex !== -1) {
            updateRecursive(newData.projects[projectIndex].tasks);
            setData(newData);
            setTask(updatedTask);

            await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
        }
    };

    const handleStartTask = () => {
        const now = new Date().toISOString();
        const updatedTask = {
            ...task,
            status: 'In Progress',
            lastStartedAt: now,
            timeLogs: [...(task.timeLogs || []), { start: now, end: null }]
        };
        saveUpdates(updatedTask);
    };

    const handleStopTask = () => {
        const now = new Date().toISOString();
        const lastLogIndex = task.timeLogs?.findLastIndex(l => !l.end);
        let newLogs = [...(task.timeLogs || [])];

        if (lastLogIndex !== undefined && lastLogIndex !== -1) {
            newLogs[lastLogIndex].end = now;
        }

        const updatedTask = {
            ...task,
            status: 'In Progress', // Keep in progress or optional prompt to mark done? User said start/Stop.
            lastStartedAt: null,
            timeLogs: newLogs
        };
        saveUpdates(updatedTask);
    };

    const handleSaveNotes = () => {
        const updatedTask = { ...task, notes: notesBuffer };
        saveUpdates(updatedTask);
        setIsNotesEditing(false);
    };

    if (loading) return <DashboardLayout><div className="p-10 text-gray-500">Loading Task...</div></DashboardLayout>;
    if (!task) return <DashboardLayout><div className="p-10 text-red-500">Task Not Found</div></DashboardLayout>;

    const isRunning = task.timeLogs?.some(l => !l.end);

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Link href={`/projects/${id}`} className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
                        ← Back to Project
                    </Link>
                    <Link
                        href={`/projects/${id}/tasks/${taskId}/edit`}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Edit Details
                    </Link>
                </div>

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                                    ${task.type === 'Bug' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {task.type}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-bold border
                                    ${task.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                        task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            task.status === 'Brainstorming' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                    {task.status}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
                        </div>

                        {isRunning ? (
                            <button
                                onClick={handleStopTask}
                                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20 font-bold flex items-center gap-2 animate-pulse"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Stop Task
                            </button>
                        ) : (
                            <button
                                onClick={handleStartTask}
                                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 font-bold flex items-center gap-2 transition-transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Start Task
                            </button>
                        )}
                    </div>

                    <p className="text-gray-600 text-lg mb-6">{task.description || "No description provided."}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Start Date</span>
                            <span className="text-sm font-medium text-gray-900">{task.startDate || 'Not set'}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">End Date</span>
                            <span className="text-sm font-medium text-gray-900">{task.endDate || 'Not set'}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Est. Hours</span>
                            <span className="text-sm font-medium text-gray-900">{task.estimatedHours || '-'} hrs</span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Logged Sessions</span>
                            <span className="text-sm font-medium text-gray-900">{task.timeLogs?.length || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Internal Notes</h2>
                        {!isNotesEditing && (
                            <button
                                onClick={() => setIsNotesEditing(true)}
                                className="text-blue-600 text-sm font-medium hover:underline"
                            >
                                Edit Notes
                            </button>
                        )}
                    </div>

                    {isNotesEditing ? (
                        <div>
                            <textarea
                                rows={6}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                                value={notesBuffer}
                                onChange={e => setNotesBuffer(e.target.value)}
                                placeholder="Add technical notes, observations, or todos..."
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveNotes}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                                >
                                    Save Notes
                                </button>
                                <button
                                    onClick={() => { setIsNotesEditing(false); setNotesBuffer(task.notes || ''); }}
                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={`prose max-w-none text-gray-700 ${!task.notes ? 'italic text-gray-400' : ''}`}>
                            {task.notes ? <pre className="whitespace-pre-wrap font-sans">{task.notes}</pre> : 'No notes added yet.'}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
