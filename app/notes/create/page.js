'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import 'react-quill-new/dist/quill.snow.css'; // Import Quill styles

// Dynamic import for ReactQuill to avoid SSR issues
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { api } from '@/services/api';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => {
    // Configure highlight.js on window for Quill if needed, but the module config is usually enough
    if (typeof window !== 'undefined') {
        window.hljs = hljs;
    }
    return import('react-quill-new');
}, { ssr: false });

export default function CreateNotePage() {
    // Ensure hljs is available for the module configuration

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const modules = {
        toolbar: [
            [{ 'font': [] }, { 'size': [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }, { 'align': [] }],
            ['link', 'image', 'video', 'formula'],
            ['clean']
        ],
        syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
        },
    };

    const formats = [
        'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
        'color', 'background',
        'script', 'header',
        'list', 'indent',
        'direction', 'align',
        'link', 'image', 'video', 'formula'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setSaving(true);
        try {
            await api.createNote({ title, content });
            router.push('/notes');
        } catch (error) {
            console.error(error);
            alert(error.message || 'Error saving note');
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col">
                <header className="mb-6 flex justify-between items-center">
                    <Link href="/notes" className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 font-medium">
                        ← Back
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || !title.trim()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-sm"
                    >
                        {saving ? 'Saving...' : 'Save Note'}
                    </button>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
                    <input
                        type="text"
                        placeholder="Note Title"
                        className="w-full text-2xl font-bold p-6 border-b border-gray-100 outline-none text-gray-900 placeholder:text-gray-300"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />

                    <div className="flex-1 overflow-y-auto">
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                            className="h-full flex flex-col"
                            placeholder="Start writing..."
                        />
                        {/* Custom CSS to fix Quill height issues if needed in global.css, but flex usually works */}
                        <style jsx global>{`
                            .quill {
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                            }
                            /* Custom overrides for syntax highlighting in editor */
                            .ql-snow .ql-editor pre.ql-syntax {
                                background-color: #282c34;
                                color: #abb2bf;
                                border-radius: 6px;
                                padding: 1em;
                            }
                            .ql-toolbar {
                                border: none !important;
                                border-bottom: 1px solid #f3f4f6 !important;
                                padding: 12px 16px !important;
                            }
                            .ql-container {
                                flex: 1;
                                border: none !important;
                                font-size: 1.1em;
                                font-family: inherit;
                            }
                            .ql-editor {
                                padding: 24px;
                            }
                        `}</style>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
