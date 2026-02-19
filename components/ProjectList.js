'use client';

import Link from 'next/link';
import ProgressBar from './ProgressBar';
import { isDelayed, calculateDuration, getOverdueDays } from '@/utils/timeUtils';

export default function ProjectList({ projects }) {
    if (!projects || projects.length === 0) {
        return <div className="text-center text-gray-500 py-10">No projects found.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => {
                const delayed = isDelayed(project.startDate, project.endDate, project.status);
                const duration = calculateDuration(project.startDate, project.endDate);

                return (
                    <Link href={`/projects/${project.id}`} key={project.id} className="group relative">
                        <style jsx>{`
                            @keyframes dash {
                                0% { background-position: 0 0, 0 100%, 0 0, 100% 0; }
                                100% { background-position: 20px 0, -20px 100%, 0 -20px, 100% 20px; }
                            }
                            .animate-dashed-border-red {
                                background-image: 
                                    linear-gradient(90deg, #ef4444 50%, transparent 50%), 
                                    linear-gradient(90deg, #ef4444 50%, transparent 50%), 
                                    linear-gradient(0deg, #ef4444 50%, transparent 50%), 
                                    linear-gradient(0deg, #ef4444 50%, transparent 50%);
                                background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
                                background-size: 10px 1px, 10px 1px, 1px 10px, 1px 10px;
                                background-position: 0 0, 0 100%, 0 0, 100% 0;
                                animation: dash 1s linear infinite;
                            }
                        `}</style>
                        <div className={`p-6 rounded-2xl border hover:shadow-lg transition-all duration-300 shadow-sm
                            ${delayed ? 'animate-dashed-border-red bg-red-50 border-transparent' : 'bg-white border-gray-100 hover:border-blue-300'}
                        `}>
                            {delayed && (
                                <div className="absolute top-0 right-0 -mr-2 -mt-2 z-[100] group/warning">
                                    <span className="relative flex h-5 w-5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] items-center justify-center font-bold shadow-sm">!</span>
                                    </span>

                                    {/* Tooltip - High Z-Index */}
                                    <div className="absolute bottom-full right-0 mb-2 w-max max-w-[200px] hidden group-hover/warning:block z-[999]">
                                        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-xl whitespace-nowrap">
                                            <div className="font-semibold text-red-300">Overdue Project</div>
                                            <div>Due: {new Date(project.endDate).toLocaleDateString()}</div>
                                            <div>Late by: {getOverdueDays(project.endDate)} days</div>
                                        </div>
                                        <div className="w-2 h-2 bg-gray-900 rotate-45 absolute bottom-[-4px] right-2"></div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                ${project.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                        project.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                                    {project.status}
                                </span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50">
                                <ProgressBar tasks={project.tasks} />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                {project.startDate && project.endDate && (
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400">
                                            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                                        </span>
                                        {duration && <span className="text-[10px] text-gray-500 font-medium">Duration: {duration}</span>}
                                    </div>
                                )}
                                <span className="text-blue-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all ml-auto">View Details →</span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
