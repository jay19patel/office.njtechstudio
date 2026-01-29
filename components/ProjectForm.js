'use client';

import { useState } from 'react';

export default function ProjectForm({ initialData = {}, onSubmit, loading, buttonText = "Save Project" }) {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'Planning',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        ...initialData
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Project Title"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                        type="date"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                        type="date"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={formData.endDate}
                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Project details..."
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
                {loading ? 'Saving...' : buttonText}
            </button>
        </form>
    );
}
