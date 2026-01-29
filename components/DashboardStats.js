import StatusCard from './StatusCard';

export default function DashboardStats({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <StatusCard
                label="Total Projects"
                count={stats.totalProjects}
                type="info" // Blue
                isActive={true}
                href="/projects"
            />
            <StatusCard
                label="Total Tasks"
                count={stats.totalTasks}
                type="pink" // Pink
                isActive={true}
                href="/tasks"
            />
            <StatusCard
                label="Open Tasks"
                count={stats.openTasks}
                type="orange" // Orange
                isActive={true}
                href="/tasks?status=In Progress"
            />
            <StatusCard
                label="Total Bugs"
                count={stats.totalBugs}
                type="purple" // Purple
                isActive={true}
                href="/tasks?type=Bug"
            />
            <StatusCard
                label="Critical Alerts"
                count={stats.totalCritical}
                type="red" // Red for Critical
                isActive={true}
                href="/tasks?critical=true"
            />
        </div>
    );
}
