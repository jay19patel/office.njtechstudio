'use client';

import Link from 'next/link';

export default function ProjectList({ projects }) {
    if (!projects || projects.length === 0) {
        return <div className="text-center text-gray-500 py-10">No projects found.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id} className="group">
                    <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 shadow-sm">
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

                        <div className="flex justify-between items-center text-sm text-gray-400 pt-4 border-t border-gray-50">
                            <span>{project.tasks?.length || 0} Tasks</span>
                            <span className="text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">View Details →</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
