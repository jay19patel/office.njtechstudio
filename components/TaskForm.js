'use client';

import { useState } from 'react';
import AiGenerator from './AiGenerator';

export default function TaskForm({ initialData = {}, onSubmit, loading, buttonText = "Save Task" }) {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        type: initialData.type || 'Task',
        status: initialData.status || 'Todo',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',

        ...initialData
    });

    const handleAiFill = (template) => {
        setFormData(prev => ({
            ...prev,
            title: template.title,
            description: template.description,
            type: template.type || prev.type,
            status: template.status || prev.status,
            startDate: template.startDate,
            endDate: template.endDate,
            estimatedHours: template.estimatedHours || prev.estimatedHours
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isReadOnly = initialData.status === 'Completed';

    return (
        <div className="space-y-6">
            {isReadOnly && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                This task is <strong>Completed</strong> and cannot be edited.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!isReadOnly && <AiGenerator onGenerate={handleAiFill} type="task" />}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                        required
                        disabled={isReadOnly}
                        className={`w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Task Title"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                            disabled={isReadOnly}
                            className={`w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Task">Task</option>
                            <option value="Epic">Epic</option>
                            <option value="Bug">Bug</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            disabled={isReadOnly}
                            className={`w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Brainstorming">Brainstorming</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                {formData.type === 'Epic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                disabled={isReadOnly}
                                className={`w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                disabled={isReadOnly}
                                className={`w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                                value={formData.endDate}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        rows={4}
                        disabled={isReadOnly}
                        className={`w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Task details..."
                    />
                </div>

                {!isReadOnly && (
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? 'Saving...' : buttonText}
                    </button>
                )}
            </form>
        </div>
    );
}
