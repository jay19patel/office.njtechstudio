'use client';

export default function UserProgressList({ users, projects }) {
    // Helper: Get stats for a single user
    const getUserStats = (userId) => {
        let total = 0;
        let completed = 0;

        const traverse = (tasks) => {
            tasks.forEach(task => {
                if (task.assigneeId === userId) {
                    total++;
                    if (task.status === 'Done' || task.status === 'Completed') {
                        completed++;
                    }
                }
                if (task.subtasks) traverse(task.subtasks);
            });
        };

        if (projects) {
            projects.forEach(p => traverse(p.tasks));
        }

        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { total, completed, percentage };
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                Team Performance
            </h3>

            <div className="space-y-6">
                {users.map(user => {
                    const stats = getUserStats(user.id);
                    // Only show users with assigned tasks (optional, but requested layout implies active users)
                    // or show all. Let's show all but maybe dim those with 0 tasks.
                    if (stats.total === 0) return null;

                    return (
                        <div key={user.id}>
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex items-center gap-3">
                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-gray-100" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                                        <p className="text-xs text-gray-400">{stats.completed} / {stats.total} Tasks Completed</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-700">{stats.percentage}%</span>
                            </div>

                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${stats.percentage === 100 ? 'bg-green-500' :
                                            stats.percentage > 50 ? 'bg-blue-500' : 'bg-orange-400'
                                        }`}
                                    style={{ width: `${stats.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
                {users.every(u => getUserStats(u.id).total === 0) && (
                    <p className="text-gray-400 text-sm italic">No tasks assigned to anyone yet.</p>
                )}
            </div>
        </div>
    );
}
