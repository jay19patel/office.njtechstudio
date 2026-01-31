'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function GuidePage() {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Guide</h1>
                    <p className="text-gray-500">Learn how to effectively manage your workspace.</p>
                </div>

                <div className="space-y-8">
                    {/* Notes Section */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">1. Notes</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            The <strong>Notes</strong> section is your personal knowledge base. Use it for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>Drafting ideas before they become projects.</li>
                            <li>Storing meeting minutes and quick reminders.</li>
                            <li>Saving code snippets or important links.</li>
                        </ul>
                    </section>

                    {/* Projects Section */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">2. Projects</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            <strong>Projects</strong> are the high-level containers for your work. A project represents a specific goal with a start and end date.
                        </p>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <h3 className="font-semibold text-purple-800 mb-2">How to use Projects:</h3>
                            <ol className="list-decimal list-inside space-y-2 text-purple-700">
                                <li>Create a Project for a client or a major internal initiative (e.g., "Website Redesign").</li>
                                <li>Define the scope and timeline.</li>
                                <li>Add Tasks inside the project to track progress.</li>
                            </ol>
                        </div>
                    </section>

                    {/* Tasks Hierarchy */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">3. Tasks & Types</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Understanding the different types of tasks helps organize work effectively:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                                    <h3 className="font-bold text-gray-800">Epic</h3>
                                </div>
                                <p className="text-sm text-gray-600">A large body of work that can be broken down into smaller tasks. (e.g., "User Authentication Module").</p>
                            </div>

                            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    <h3 className="font-bold text-gray-800">Story</h3>
                                </div>
                                <p className="text-sm text-gray-600">A feature from the user's perspective. Small enough to be completed in a few days. (e.g., "As a user, I want to login with Email").</p>
                            </div>

                            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    <h3 className="font-bold text-gray-800">Task</h3>
                                </div>
                                <p className="text-sm text-gray-600">A generic work item or chore, often technical. (e.g., "Setup Database Schema").</p>
                            </div>

                            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <h3 className="font-bold text-gray-800">Bug</h3>
                                </div>
                                <p className="text-sm text-gray-600">Something that is broken or not working as intended. Needs fixing.</p>
                            </div>
                        </div>
                    </section>

                    {/* Status Workflow */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">4. Workflow Statuses</h2>
                        </div>
                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pl-6 py-2">
                            <div className="relative">
                                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></span>
                                <h3 className="font-bold text-gray-800">Todo / Pending</h3>
                                <p className="text-sm text-gray-600">Work that has been identified but not yet started.</p>
                            </div>
                            <div className="relative">
                                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></span>
                                <h3 className="font-bold text-blue-600">In Progress</h3>
                                <p className="text-sm text-gray-600">Work actively being done right now.</p>
                            </div>
                            <div className="relative">
                                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-yellow-500 border-2 border-white"></span>
                                <h3 className="font-bold text-yellow-600">Review</h3>
                                <p className="text-sm text-gray-600">Work completed but waiting for approval or testing.</p>
                            </div>
                            <div className="relative">
                                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></span>
                                <h3 className="font-bold text-green-600">Completed</h3>
                                <p className="text-sm text-gray-600">Work fully finished and verified.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}
