
const API_BASE = '/api';

async function fetchClient(endpoint, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (!response.ok) {
        // Handle 401/403 specifically if needed, or generic errors
        const errorBody = await response.json().catch(() => ({}));
        const error = new Error(errorBody.message || 'API request failed');
        error.status = response.status;
        throw error;
    }

    // For 204 No Content
    if (response.status === 204) return null;

    return response.json();
}

export const api = {
    // Unauthenticated / Public
    getOfficeSettings: (pin) => fetchClient(`/settings?pin=${pin}`),

    // Data
    getBugs: () => fetchClient('/data'),
    getSprints: () => fetchClient('/sprint'),
    getSprintDaily: (date) => fetchClient(`/sprint/daily?date=${date}`),

    // Projects
    getProjects: () => fetchClient('/projects'),
    getProject: (id) => fetchClient(`/projects/${id}`),

    // Tasks
    getAllTasks: () => fetchClient('/tasks'),
    getTasks: (projectId) => fetchClient(`/projects/${projectId}/tasks`),
    getTask: (projectId, taskId) => fetchClient(`/projects/${projectId}/tasks/${taskId}`),
    updateTask: (taskId, data) => fetchClient(`/tasks`, {
        method: 'PUT',
        body: JSON.stringify({ id: taskId, ...data })
    }),

    // Notes
    getNotes: (query = '') => fetchClient(`/notes?query=${encodeURIComponent(query)}`),
    getNote: (id) => fetchClient(`/notes/${id}`),
    createNote: (data) => fetchClient('/notes', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateNote: (id, data) => fetchClient(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    // Sprints
    createSprint: (data) => fetchClient('/sprint', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // Generic
    post: (endpoint, data) => fetchClient(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    put: (endpoint, data) => fetchClient(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (endpoint) => fetchClient(endpoint, {
        method: 'DELETE'
    })
};
