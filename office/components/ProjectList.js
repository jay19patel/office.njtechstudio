'use client';

import Link from 'next/link';
import ProgressBar from './ProgressBar';
import { isDelayed, calculateDuration } from '@/utils/timeUtils';

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
                        <div className={`p-6 rounded-2xl bg-white border hover:shadow-lg transition-all duration-300 shadow-sm
                            ${delayed ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-100 hover:border-blue-300'}
                        `}>
                            {delayed && (
                                <div className="absolute top-0 right-0 -mt-2 -mr-2 flex h-6 w-6 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-white text-[10px] items-center justify-center font-bold">!</span>
                                    <span className="absolute top-0 right-8 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                        Time Warning
                                    </span>
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
