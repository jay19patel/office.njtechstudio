import { useQuery, keepPreviousData } from '@tanstack/react-query';

// Fetcher functions
const fetchProjectData = async () => {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('Failed to fetch project data');
    return res.json();
};

const fetchSprintData = async () => {
    const res = await fetch('/api/sprint');
    if (!res.ok) throw new Error('Failed to fetch sprint data');
    return res.json();
};

const fetchNotesData = async (searchQuery = '') => {
    const res = await fetch(`/api/notes?q=${encodeURIComponent(searchQuery)}`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
};

// Hooks
export const useProjectData = () => {
    return useQuery({
        queryKey: ['projectData'],
        queryFn: fetchProjectData,
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false, // Prevent glitter on window focus
    });
};

export const useSprintData = () => {
    return useQuery({
        queryKey: ['sprintData'],
        queryFn: fetchSprintData,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useNotesData = (searchQuery) => {
    return useQuery({
        queryKey: ['notesData', searchQuery],
        queryFn: () => fetchNotesData(searchQuery),
        staleTime: 60 * 1000,
        placeholderData: keepPreviousData, // Keep showing previous data while fetching new search results
        refetchOnWindowFocus: false,
    });
};
