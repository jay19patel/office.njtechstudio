'use client';

export default function DashboardStats({ stats }) {
    const cards = [
        { label: 'Total Projects', value: stats.totalProjects, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'Total Users', value: stats.totalUsers, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        { label: 'Total Bugs', value: stats.totalBugs, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
        { label: 'Total Tasks', value: stats.totalTasks, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
        { label: 'Open Tasks', value: stats.openTasks, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`relative overflow-hidden p-6 rounded-2xl bg-white border ${card.border} shadow-sm hover:shadow-md transition-shadow`}
                >
                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-50 ${card.bg}`} />
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider relative z-10">{card.label}</h3>
                    <p className={`text-4xl font-bold mt-2 ${card.color} relative z-10`}>{card.value}</p>
                </div>
            ))}
        </div>
    );
}
