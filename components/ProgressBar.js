'use client';

export default function ProgressBar({ tasks = [], showCounts = false }) {
    // Helper to count tasks recursively
    const countStats = (taskList) => {
        let total = 0;
        let completed = 0;
        let inProgress = 0;
        let brainstorming = 0;

        const traverse = (list) => {
            list.forEach(task => {
                total++;
                if (task.status === 'Completed' || task.status === 'Done') {
                    completed++;
                } else if (task.status === 'In Progress') {
                    inProgress++;
                } else if (task.status === 'Brainstorming') {
                    brainstorming++;
                }
                if (task.subtasks) traverse(task.subtasks);
            });
        };
        traverse(taskList);

        return { total, completed, inProgress, brainstorming };
    };

    const stats = countStats(tasks);

    if (stats.total === 0) {
        return (
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gray-200"></div>
            </div>
        );
    }

    const completedPercent = (stats.completed / stats.total) * 100;
    const inProgressPercent = (stats.inProgress / stats.total) * 100;
    // The rest is implied by background

    return (
        <div className="w-full flex flex-col gap-1">
            <div className={`w-full bg-gray-200 rounded-full overflow-hidden flex ${showCounts ? 'h-3' : 'h-2'}`}>
                {/* Completed (Green) */}
                <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${completedPercent}%` }}
                ></div>
                {/* In Progress (Yellow) */}
                <div
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${inProgressPercent}%` }}
                ></div>
                {/* Brainstorming (Purple) */}
                <div
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${(stats.brainstorming / stats.total) * 100}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-medium px-1">
                {showCounts ? (
                    <>
                        <span className="text-green-600">{stats.completed} Done</span>
                        <span className="text-yellow-600">{stats.inProgress} Active</span>
                        <span className="text-gray-500">{stats.total} Total</span>
                    </>
                ) : (
                    <>
                        <span>{Math.round(completedPercent)}% Done</span>
                        <span>{stats.total} Tasks</span>
                    </>
                )}
            </div>
        </div>
    );
}
