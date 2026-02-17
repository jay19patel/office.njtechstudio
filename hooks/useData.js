
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

// Keys
export const KEYS = {
    BUGS: ['bugs'],
    SPRINTS: ['sprints'],
    SPRINT_DAILY: (date) => ['sprint', 'daily', date],
    PROJECTS: ['projects'],
    PROJECT: (id) => ['projects', id],
    TASKS: (projectId) => ['projects', projectId, 'tasks'],
    TASK: (projectId, taskId) => ['projects', projectId, 'tasks', taskId],
    NOTES: (query) => ['notes', { query }],
    NOTE: (id) => ['notes', id],
    SETTINGS: ['settings'],
    ALL_TASKS: ['all-tasks'],
};

// Hooks

export function useBugs() {
    return useQuery({
        queryKey: KEYS.BUGS,
        queryFn: api.getBugs,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useSprints() {
    return useQuery({
        queryKey: KEYS.SPRINTS,
        queryFn: api.getSprints,
    });
}

export function useSprintDaily(date) {
    return useQuery({
        queryKey: KEYS.SPRINT_DAILY(date),
        queryFn: () => api.getSprintDaily(date),
        enabled: !!date,
    });
}

export function useProjects() {
    return useQuery({
        queryKey: KEYS.PROJECTS,
        queryFn: api.getProjects,
    });
}

export function useProject(id) {
    return useQuery({
        queryKey: KEYS.PROJECT(id),
        queryFn: () => api.getProject(id),
        enabled: !!id,
    });
}

export function useTasks(projectId) {
    return useQuery({
        queryKey: KEYS.TASKS(projectId),
        queryFn: () => api.getTasks(projectId),
        enabled: !!projectId,
    });
}

export function useNotes(query = '') {
    return useQuery({
        queryKey: KEYS.NOTES(query),
        queryFn: () => api.getNotes(query),
        keepPreviousData: true,
    });
}

export function useNote(id) {
    return useQuery({
        queryKey: KEYS.NOTE(id),
        queryFn: () => api.getNote(id),
        enabled: !!id,
    });
}

// Mutations

export function useCreateSprint() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.createSprint,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYS.SPRINTS });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, data }) => api.updateTask(taskId, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: KEYS.PROJECTS });
        },
    });
}

export function useCreateNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYS.NOTES('') });
        },
    });
}

export function useUpdateNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => api.updateNote(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: KEYS.NOTE(variables.id) });
            queryClient.invalidateQueries({ queryKey: KEYS.NOTES('') });
        },
    });
}

export function useAllTasks() {
    return useQuery({
        queryKey: KEYS.ALL_TASKS,
        queryFn: api.getAllTasks,
    });
}
