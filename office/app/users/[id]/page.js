'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TaskTree from '@/components/TaskTree';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function UserDetailsPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/data')
            .then(r => r.json())
            .then(json => {
                setData(json);
                setLoading(false);
            });
    }, []);

    if (loading) return <DashboardLayout><div className="p-10 text-gray-500">Loading...</div></DashboardLayout>;

    const user = data.users.find(u => u.id === id);
    if (!user) return <DashboardLayout><div className="p-10 text-red-500">User not found</div></DashboardLayout>;

    const getUserTasksByProject = () => {
        const projectTasks = [];

        data.projects.forEach(project => {
            const assignedTasks = [];
            const traverse = (tasks) => {
                tasks.forEach(task => {
                    if (task.assigneeId === user.id) {
                        assignedTasks.push(task);
                    }
                    if (task.subtasks) traverse(task.subtasks);
                });
            };
            traverse(project.tasks);

            if (assignedTasks.length > 0) {
                projectTasks.push({
                    projectTitle: project.title,
                    projectId: project.id,
                    tasks: assignedTasks
                });
            }
        });
        return projectTasks;
    };

    const assignedProjects = getUserTasksByProject();

    return (
        <DashboardLayout>
            <Link href="/users" className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6 inline-block">← Back to Users</Link>

            <div className="flex items-center gap-6 mb-10 border-b border-gray-100 pb-8">
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-gray-500 text-lg">{user.role}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-purple-500 pl-3">Assigned Tasks</h2>

            {assignedProjects.length === 0 ? (
                <div className="text-gray-500 bg-gray-50 p-6 rounded-xl border border-gray-100 italic">No tasks assigned to {user.name}.</div>
            ) : (
                <div className="space-y-8">
                    {assignedProjects.map(group => (
                        <div key={group.projectId} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Project: {group.projectTitle}
                            </h3>
                            <TaskTree tasks={group.tasks} users={data.users} />
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
