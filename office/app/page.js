import DashboardLayout from "../components/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            change="+20.1% from last month"
            trend="up"
            icon={<DollarIcon />}
          />
          <StatCard
            title="Active Projects"
            value="12"
            change="+2 new this week"
            trend="up"
            icon={<FolderIcon />}
          />
          <StatCard
            title="Team Members"
            value="24"
            change="+4 new joined"
            trend="up"
            icon={<UsersIcon />}
          />
          <StatCard
            title="Pending Tasks"
            value="7"
            change="-3 from yesterday"
            trend="down"
            icon={<ClipboardListIcon />}
          />
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Chart Area (Dummy) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
              <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last year</option>
              </select>
            </div>

            <div className="h-80 flex items-end justify-between gap-2 px-2">
              {[40, 65, 30, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                <div key={i} className="w-full bg-purple-100 rounded-t-lg relative group transition-all hover:bg-purple-200">
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${h}%` }}
                  ></div>
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                    ${h}k
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium uppercase tracking-wide">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              <ActivityItem
                user="Sarah Connor"
                action="completed the task"
                target="Homepage Redesign"
                time="2 hours ago"
                initial="SC"
                color="bg-pink-500"
              />
              <ActivityItem
                user="Alex Morgan"
                action="added a new file to"
                target="Marketing Assets"
                time="4 hours ago"
                initial="AM"
                color="bg-blue-500"
              />
              <ActivityItem
                user="James Bond"
                action="commented on"
                target="Project Alpha"
                time="5 hours ago"
                initial="JB"
                color="bg-green-500"
              />
              <ActivityItem
                user="Natasha Romanoff"
                action="uploaded a document"
                target="Q4 Report"
                time="1 day ago"
                initial="NR"
                color="bg-purple-500"
              />
            </div>
            <button className="w-full mt-6 py-2.5 text-sm font-semibold text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              View All Activity
            </button>
          </div>
        </div>

        {/* Project Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Active Projects</h3>
            <button className="text-sm font-medium text-purple-600 hover:text-purple-700">Sort by Date</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="pb-4 pl-4">Project Name</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Team</th>
                  <th className="pb-4">Progress</th>
                  <th className="pb-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                <ProjectRow
                  name="App Development"
                  client="Google Inc."
                  status="In Progress"
                  statusColor="text-blue-600 bg-blue-50"
                  progress={75}
                  date="Oct 24, 2024"
                />
                <ProjectRow
                  name="Marketing Campaign"
                  client="Spotify"
                  status="Pending"
                  statusColor="text-orange-600 bg-orange-50"
                  progress={30}
                  date="Nov 12, 2024"
                />
                <ProjectRow
                  name="Website Redesign"
                  client="Airbnb"
                  status="Completed"
                  statusColor="text-green-600 bg-green-50"
                  progress={100}
                  date="Sep 30, 2024"
                />
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

// Sub-components for Cleaner Code

function StatCard({ title, value, change, trend, icon }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gray-50 rounded-xl text-gray-600">
          {icon}
        </div>
        {trend === 'up' ? (
          <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            +12.5%
          </span>
        ) : (
          <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            -2.4%
          </span>
        )}
      </div>
      <div>
        <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
        <h2 className="text-3xl font-bold text-gray-900 mb-1">{value}</h2>
        <p className="text-xs text-gray-400">{change}</p>
      </div>
    </div>
  )
}

function ActivityItem({ user, action, target, time, initial, color }) {
  return (
    <div className="flex gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${color}`}>
        {initial}
      </div>
      <div>
        <p className="text-sm text-gray-900 leading-snug">
          <span className="font-semibold">{user}</span> {action} <span className="font-semibold text-gray-700">{target}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  )
}

function ProjectRow({ name, client, status, statusColor, progress, date }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="py-4 pl-4">
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{client}</p>
        </div>
      </td>
      <td className="py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="py-4">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              U{i}
            </div>
          ))}
        </div>
      </td>
      <td className="py-4 pr-6">
        <div className="w-24 bg-gray-100 rounded-full h-2">
          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-1 font-medium">{progress}% Complete</p>
      </td>
      <td className="py-4 text-gray-500 font-medium">{date}</td>
    </tr>
  )
}


// Icons (Duplicated for simplicity, ideally import from a shared icon file or library)

function DollarIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ClipboardListIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}
