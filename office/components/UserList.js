'use client';

import Link from 'next/link';

export default function UserList({ users, projects }) {
    // Helper to count tasks assigned to a specific user
    const countUserTasks = (userId, tasks = []) => {
        let count = 0;
        tasks.forEach(task => {
            if (task.assigneeId === userId) count++;
            if (task.subtasks) {
                count += countUserTasks(userId, task.subtasks);
            }
        });
        return count;
    };

    const getUserTaskCount = (userId) => {
        let total = 0;
        if (projects) {
            projects.forEach(p => {
                total += countUserTasks(userId, p.tasks);
            });
        }
        return total;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => {
                const taskCount = getUserTaskCount(user.id);
                return (
                    <Link href={`/users/${user.id}`} key={user.id} className="group">
                        <div className="flex items-center gap-4 p-6 rounded-2xl bg-white border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all shadow-sm">
                            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-purple-100" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.role}</p>
                                <div className="mt-2 text-xs font-medium px-2 py-1 rounded bg-purple-50 text-purple-600 inline-block border border-purple-100">
                                    {taskCount} Assigned Tasks
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
