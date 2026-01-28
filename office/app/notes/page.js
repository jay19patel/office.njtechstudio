'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter, useSearchParams } from 'next/navigation';

function NotesContent() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/notes?q=${searchQuery}`);
                if (res.ok) {
                    const data = await res.json();
                    setNotes(data);
                }
            } catch (error) {
                console.error("Failed to fetch notes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [searchQuery]);

    const handleSearch = (e) => {
        const term = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        router.replace(`/notes?${params.toString()}`);
    };

    return (
        <div className="flex flex-col h-full">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
                    <p className="text-gray-500 mt-1">Capture ideas, code snippets, and daily tasks.</p>
                </div>
                <Link
                    href="/notes/create"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm font-medium flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Note
                </Link>
            </header>

            {/* Search */}
            <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search notes..."
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-48 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                        </div>
                    ))}
                </div>
            ) : notes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No notes found</h3>
                    <p className="text-gray-500 mb-6">Start writing down your thoughts.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map(note => (
                        <Link href={`/notes/${note._id}`} key={note._id} className="group block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-64 flex flex-col relative overflow-hidden">
                            <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                {note.title}
                            </h2>
                            <div
                                className="text-gray-500 text-sm line-clamp-5 prose prose-sm mb-4 flex-1"
                                dangerouslySetInnerHTML={{ __html: note.content }}
                            />
                            <div className="text-xs text-gray-400 border-t border-gray-50 pt-3 flex justify-between items-center bg-white">
                                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                                <span className="opacity-0 group-hover:opacity-100 text-blue-500 font-medium transition-opacity">Read More →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function NotesPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading notes...</div>}>
                <NotesContent />
            </Suspense>
        </DashboardLayout>
    );
}
