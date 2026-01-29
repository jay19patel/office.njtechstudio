'use client';

export default function VisualAnalytics({ projects }) {
    if (!projects) return null;

    // 1. Task Status Distribution (Aggregate)
    const taskStats = {
        completed: 0,
        inProgress: 0,
        pending: 0,
        total: 0
    };

    const countStats = (tasks) => {
        tasks.forEach(t => {
            taskStats.total++;
            if (t.status === 'Completed' || t.status === 'Done') taskStats.completed++;
            else if (t.status === 'In Progress') taskStats.inProgress++;
            else taskStats.pending++;

            if (t.subtasks) countStats(t.subtasks);
        });
    };

    projects.forEach(p => countStats(p.tasks));

    // Calculate percentages
    const getPct = (val) => taskStats.total > 0 ? (val / taskStats.total) * 100 : 0;
    const completedPct = getPct(taskStats.completed);
    const inProgressPct = getPct(taskStats.inProgress);
    const pendingPct = getPct(taskStats.pending);

    // 2. Project Timeline / Progress
    const projectProgress = projects.map(p => {
        let pTotal = 0;
        let pDone = 0;
        const countP = (tasks) => {
            tasks.forEach(t => {
                pTotal++;
                if (t.status === 'Completed' || t.status === 'Done') pDone++;
                if (t.subtasks) countP(t.subtasks);
            });
        };
        countP(p.tasks);
        return {
            title: p.title,
            percent: pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0,
            status: p.status,
            totalTasks: pTotal
        };
    });

    // SVG Pie Chart Calculation
    // Circumference = 2 * PI * R
    // R=40 => C ≈ 251.2
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    const offsetCompleted = 0;
    const strokeCompleted = (completedPct / 100) * circumference;

    // Start of InProgress is End of Completed. 
    // SVG stroke-dashoffset works counter-clockwise usually or simplified:
    // We can use a rotational transform or cumulative offsets.
    // Simpler approach: stack segments using dasharray and offsets.

    // Segment 1 (Completed): Starts at -90deg (12 o'clock). Length = strokeCompleted.
    // Segment 2 (InProgress): Starts after Segment 1. Offset = -strokeCompleted.
    const offsetInProgress = -strokeCompleted;
    const strokeInProgress = (inProgressPct / 100) * circumference;

    // Segment 3 (Pending): Starts after Segment 2. Offset = -(strokeCompleted + strokeInProgress).
    const offsetPending = -(strokeCompleted + strokeInProgress);
    const strokePending = (pendingPct / 100) * circumference;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Pie Chart Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-1">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Task Composition</h3>
                    <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">Total: {taskStats.total}</span>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            {/* Background Circle */}
                            <circle cx="50" cy="50" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="12" />

                            {/* Completed Segment (Green) */}
                            {completedPct > 0 && (
                                <circle
                                    cx="50" cy="50" r={radius}
                                    fill="none" stroke="#22c55e" strokeWidth="12"
                                    strokeDasharray={`${strokeCompleted} ${circumference}`}
                                    strokeDashoffset={offsetCompleted}
                                    className="transition-all duration-1000 ease-out"
                                />
                            )}

                            {/* In Progress Segment (Blue) */}
                            {inProgressPct > 0 && (
                                <circle
                                    cx="50" cy="50" r={radius}
                                    fill="none" stroke="#3b82f6" strokeWidth="12"
                                    strokeDasharray={`${strokeInProgress} ${circumference}`}
                                    strokeDashoffset={offsetInProgress}
                                    className="transition-all duration-1000 ease-out"
                                />
                            )}

                            {/* Pending Segment (Gray) */}
                            {pendingPct > 0 && (
                                <circle
                                    cx="50" cy="50" r={radius}
                                    fill="none" stroke="#9ca3af" strokeWidth="12"
                                    strokeDasharray={`${strokePending} ${circumference}`}
                                    strokeDashoffset={offsetPending}
                                    className="transition-all duration-1000 ease-out"
                                />
                            )}
                        </svg>

                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-900">{Math.round(completedPct)}%</span>
                            <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Done</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="w-full grid grid-cols-3 gap-2 mt-8 px-2">
                        <div className="flex flex-col items-center p-2 rounded-lg bg-green-50">
                            <span className="text-xl font-bold text-green-700">{taskStats.completed}</span>
                            <span className="text-[10px] uppercase font-bold text-green-600">Done</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-blue-50">
                            <span className="text-xl font-bold text-blue-700">{taskStats.inProgress}</span>
                            <span className="text-[10px] uppercase font-bold text-blue-600">Active</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
                            <span className="text-xl font-bold text-gray-700">{taskStats.pending}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-500">Pending</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Progress Overview */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-1 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Project Progress Insights</h3>
                <div className="space-y-6">
                    {projectProgress.map((p, idx) => (
                        <div key={idx} className="group cursor-default">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{p.title}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{p.totalTasks} Tasks Total • {p.status}</p>
                                </div>
                                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs transition-colors group-hover:bg-blue-100">
                                    {p.percent}% Complete
                                </span>
                            </div>
                            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm group-hover:shadow-md ${p.percent === 100 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                            p.status === 'In Progress' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                                                'bg-gradient-to-r from-purple-400 to-purple-500'
                                        }`}
                                    style={{ width: `${p.percent}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}

                    {projects.length === 0 && (
                        <div className="text-center text-gray-400 py-10">No active projects to display.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
