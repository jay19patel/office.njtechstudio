"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";

export default function CreateSprintPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [groupedTasks, setGroupedTasks] = useState([]);
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedProjects, setExpandedProjects] = useState({}); // { projectId: boolean }
    const [expandedEpics, setExpandedEpics] = useState({}); // { epicId: boolean }

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/tasks");
            if (res.ok) {
                const data = await res.json();
                setGroupedTasks(data.groupedTasks || []);
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleProject = (projectId) => {
        setExpandedProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
    };

    const toggleEpic = (epicId) => {
        setExpandedEpics(prev => ({ ...prev, [epicId]: !prev[epicId] }));
    };

    const toggleTaskSelection = (taskId) => {
        setSelectedTaskIds(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const handleSave = async () => {
        if (!title || !date) {
            alert("Please enter a title and date.");
            return;
        }
        if (selectedTaskIds.length === 0) {
            alert("Please select at least one task.");
            return;
        }

        try {
            const res = await fetch("/api/sprint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, date, taskIds: selectedTaskIds }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/sprint");
            } else {
                alert(data.error || "Failed to save sprint.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        }
    };

    // Helper to organize tasks into Epics vs Standalone within a project
    const organizeProjectTasks = (tasks) => {
        const epics = tasks.filter(t => t.type === 'Epic');
        const standaloneTasks = tasks.filter(t => t.type !== 'Epic' && !t.parentId); // No parent = standalone or direct child of project

        // Map epics to include their subtasks (tasks that have parentId === epic._id)
        // Note: The API currently returns flat list per project. We need to associate them.
        // Assuming database IDs match parentId field strings.

        const structuredEpics = epics.map(epic => {
            // Fix: Match using custom 'id' (e.g. "t_ai_def_1") instead of Mongo '_id'
            const subtasks = tasks.filter(t => t.parentId === epic.id);
            return { ...epic, subtasks };
        });

        return { structuredEpics, standaloneTasks };
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Sprint</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sprint Title</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., Sprint 4 Kickoff Plan"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Tasks</h2>

                    {loading ? (
                        <div className="text-center py-10 text-gray-400">Loading projects...</div>
                    ) : (
                        <div className="space-y-4">
                            {groupedTasks.length > 0 ? (
                                groupedTasks.map((group) => {
                                    const { structuredEpics, standaloneTasks } = organizeProjectTasks(group.tasks);
                                    const isProjectExpanded = expandedProjects[group.project._id];

                                    return (
                                        <div key={group.project._id} className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Project Header */}
                                            <div
                                                className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                                                onClick={() => toggleProject(group.project._id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`transform transition-transform ${isProjectExpanded ? 'rotate-90' : ''}`}>
                                                        ▶
                                                    </span>
                                                    <h3 className="font-medium text-gray-900">{group.project.title}</h3>
                                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{group.tasks.length} tasks</span>
                                                </div>
                                            </div>

                                            {/* Project Content */}
                                            {isProjectExpanded && (
                                                <div className="p-4 bg-white space-y-4">

                                                    {/* Epics */}
                                                    {structuredEpics.map(epic => (
                                                        <div key={epic._id} className="ml-4 border-l-2 border-purple-100 pl-4">
                                                            <div
                                                                className="flex items-center gap-2 cursor-pointer py-1"
                                                                onClick={() => toggleEpic(epic._id)}
                                                            >
                                                                <span className={`text-xs transform transition-transform ${expandedEpics[epic._id] ? 'rotate-90' : ''}`}>▶</span>
                                                                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">EPIC</span>
                                                                <span className="font-medium text-gray-800">{epic.title}</span>
                                                            </div>

                                                            {expandedEpics[epic._id] && (
                                                                <div className="ml-4 mt-2 space-y-2">
                                                                    {epic.subtasks.length > 0 ? (
                                                                        epic.subtasks.map(task => (
                                                                            <label key={task._id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={selectedTaskIds.includes(task._id)}
                                                                                    onChange={() => toggleTaskSelection(task._id)}
                                                                                    className="mt-1 w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                                                                />
                                                                                <div>
                                                                                    <div className="text-sm text-gray-700">{task.title}</div>
                                                                                    <div className="text-xs text-gray-400">{task.type}</div>
                                                                                </div>
                                                                            </label>
                                                                        ))
                                                                    ) : (
                                                                        <div className="text-xs text-gray-400 italic ml-6">No subtasks</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {/* Standalone Tasks */}
                                                    {standaloneTasks.length > 0 && (
                                                        <div className="ml-4 mt-4">
                                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tasks</div>
                                                            <div className="space-y-2">
                                                                {standaloneTasks.map(task => (
                                                                    <label key={task._id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedTaskIds.includes(task._id)}
                                                                            onChange={() => toggleTaskSelection(task._id)}
                                                                            className="mt-1 w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                                                        />
                                                                        <div>
                                                                            <div className="text-sm text-gray-700">{task.title}</div>
                                                                            <div className="text-xs text-gray-400">{task.type}</div>
                                                                        </div>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {structuredEpics.length === 0 && standaloneTasks.length === 0 && (
                                                        <div className="text-gray-400 text-sm">No tasks available in this project.</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-gray-500">No active projects found.</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all transform hover:-translate-y-0.5"
                    >
                        Create Sprint
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
