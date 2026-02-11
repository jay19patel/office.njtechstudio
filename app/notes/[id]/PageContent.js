'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useQuery } from '@tanstack/react-query';

// Fetcher for client-side fallback
const fetchNote = async (id) => {
    const res = await fetch(`/api/notes/${id}`);
    if (!res.ok) throw new Error('Note not found');
    return res.json();
};

export default function NoteViewPage() {
    const { id } = useParams();
    const router = useRouter();

    const { data: note, isLoading, isError } = useQuery({
        queryKey: ['note', id],
        queryFn: () => fetchNote(id),
        staleTime: 60000
    });

    useEffect(() => {
        if (note) {
            document.querySelectorAll('pre.ql-syntax').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    }, [note]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            await fetch(`/api/notes/${id}`, { method: 'DELETE' });
            router.push('/notes');
        } catch (error) {
            console.error(error);
            alert('Failed to delete');
        }
    };

    if (isLoading) return <DashboardLayout><div className="p-10 text-gray-400">Loading note...</div></DashboardLayout>;
    if (isError || !note) return <DashboardLayout><div className="p-10">Note not found</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <Link href="/notes" className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 font-medium">
                        ← Back to Notes
                    </Link>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                            Delete
                        </button>
                        <Link
                            href={`/notes/${id}/edit`}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg shadow-sm font-medium transition-colors"
                        >
                            Edit Note
                        </Link>
                    </div>
                </header>

                <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 min-h-[60vh]">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">{note.title}</h1>
                    <div className="text-xs text-gray-400 mb-8 pb-8 border-b border-gray-100">
                        Last updated on {new Date(note.updatedAt).toLocaleDateString()} at {new Date(note.updatedAt).toLocaleTimeString()}
                    </div>

                    <div
                        className="prose prose-lg prose-blue max-w-none text-gray-600 ql-editor"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                    {/* Add some basic styles for ql-syntax if prose overrides them or if they need help */}
                    <style jsx global>{`
                        pre.ql-syntax {
                            background-color: #282c34 !important;
                            color: #abb2bf !important;
                            border-radius: 6px;
                            padding: 1em;
                            overflow-x: auto;
                        }
                     `}</style>
                </article>
            </div>
        </DashboardLayout>
    );
}
