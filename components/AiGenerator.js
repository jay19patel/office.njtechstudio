'use client';

import { useState } from 'react';

export default function AiGenerator({ onGenerate, type = 'project' }) {
    const [showAi, setShowAi] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // Simulate AI delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Import dummy data statically from lib
            const { aiTemplates } = await import('@/lib/aiTemplates');

            // Always use default as requested by user
            const template = aiTemplates['default'];

            if (template) {
                if (type === 'project') {
                    onGenerate(template);
                } else if (type === 'task') {
                    // For task, pick the first task from the template or generate a generic one based on the prompt
                    // Since "default" is a project, let's extract a generic task structure
                    const genericTask = {
                        title: aiPrompt || "New AI Task",
                        description: "Generated task description based on: " + aiPrompt,
                        type: "Task",
                        status: "Pending",
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], // +7 days
                        estimatedHours: 4,
                        subtasks: []
                    };
                    onGenerate(genericTask);
                }
                setShowAi(false);
            }
        } catch (error) {
            console.error("AI Generation failed:", error);
            alert(`Failed to generate: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="mb-6">
            <div className="flex justify-end mb-4">
                <button
                    type="button"
                    onClick={() => setShowAi(!showAi)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                        ${showAi ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    `}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {showAi ? 'Hide AI Generator' : 'Generate with AI'}
                </button>
            </div>

            {showAi && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="max-w-2xl">
                        <h3 className="text-lg font-semibold text-purple-900 mb-2">Describe your {type}</h3>
                        <p className="text-sm text-purple-600 mb-4">I'll generate a complete structure for you.</p>

                        <div className="flex gap-3">
                            <input
                                className="flex-1 border-0 rounded-xl px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-purple-200 focus:ring-2 focus:ring-inset focus:ring-purple-600 placeholder:text-gray-400 outline-none"
                                placeholder={`e.g. ${type === 'project' ? 'Website Redesign' : 'Fix Login Bug'}...`}
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={isGenerating || !aiPrompt.trim()}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    'Generate'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
