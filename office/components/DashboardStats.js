import StatusCard from './StatusCard';

export default function DashboardStats({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatusCard
                label="Total Projects"
                count={stats.totalProjects}
                type="info"
                isActive={true}
                onClick={null} // Dashboard cards currently informative only
            />
            <StatusCard
                label="Total Bugs"
                count={stats.totalBugs}
                type="red"
                isActive={true}
                onClick={null}
            />
            <StatusCard
                label="Total Tasks"
                count={stats.totalTasks}
                type="pink"
                isActive={true}
                onClick={null}
            />
            <StatusCard
                label="Open Tasks"
                count={stats.openTasks}
                type="orange"
                isActive={true}
                onClick={null}
            />
        </div>
    );
}
