
import connectToDatabase from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';
import DailyPlan from '@/models/DailyPlan';
import Note from '@/models/Note';
import Office from '@/models/Office';

// Helper to reconstruct task tree
function buildTaskTree(tasks, parentId = null) {
    return tasks
        .filter(t => t.parentId === parentId)
        .map(t => ({
            ...t,
            subtasks: buildTaskTree(tasks, t.id)
        }));
}

export async function getOfficeData(officeId) {
    if (!officeId) return { projects: [], sprints: [] };

    await connectToDatabase();

    // Fetch Data Scoped by Office
    const projects = await Project.find({ officeId }).lean();
    const allTasks = await Task.find({ officeId }).lean();

    // Reconstruct Tree
    const cleanProjects = projects.map(p => {
        const { _id, __v, officeId, ...rest } = p;
        return { ...rest, id: p.id || p._id.toString() };
    });

    const cleanTasks = allTasks.map(t => {
        const { _id, __v, projectId, parentId, officeId, ...rest } = t;
        return {
            ...rest,
            projectId,
            parentId,
            id: t.id || t._id.toString()
        };
    });

    // Attach tasks to projects
    cleanProjects.forEach(p => {
        const projectTasks = cleanTasks.filter(t => t.projectId === p.id);
        p.tasks = buildTaskTree(projectTasks, null);
    });

    return {
        projects: cleanProjects,
        sprints: [] // Legacy structure kept for compatibility if needed, though getSprints is separate
    };
}

export async function getProject(id, officeId) {
    if (!id || !officeId) return null;
    await connectToDatabase();

    const project = await Project.findOne({ id, officeId }).lean();
    if (!project) return null;

    const allTasks = await Task.find({ officeId, projectId: id }).sort({ order: 1, createdAt: -1 }).lean();

    const cleanProject = { ...project };
    delete cleanProject._id;
    delete cleanProject.__v;
    delete cleanProject.officeId;
    cleanProject.id = project.id || project._id.toString();

    const cleanTasks = allTasks.map(t => {
        const { _id, __v, projectId, parentId, officeId, ...rest } = t;
        return {
            ...rest,
            projectId,
            parentId,
            id: t.id || t._id.toString()
        };
    });

    cleanProject.tasks = buildTaskTree(cleanTasks, null);

    return cleanProject;
}

export async function getSprints(officeId) {
    if (!officeId) return [];
    await connectToDatabase();
    const sprints = await DailyPlan.find({ officeId }).lean();
    return sprints.map(s => {
        const { _id, __v, officeId: oid, ...rest } = s;
        return { ...rest, id: s.id || s._id.toString() };
    });
}

export async function getNotes(officeId, query = '') {
    if (!officeId) return [];
    await connectToDatabase();

    let filter = { officeId };
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } }
        ];
    }

    const notes = await Note.find(filter).sort({ updatedAt: -1 }).lean();
    return notes.map(n => {
        const { _id, __v, officeId: oid, ...rest } = n;
        return { ...rest, id: n.id || n._id.toString() };
    });
}

export async function getNote(id) {
    if (!id) return null;
    await connectToDatabase();
    try {
        const note = await Note.findById(id).lean();
        if (!note) return null;
        const { _id, __v, officeId, ...rest } = note;
        return { ...rest, id: note.id || note._id.toString() };
    } catch (error) {
        return null;
    }
}

export async function getOfficeSettings(officePin) {
    if (!officePin) return null;
    await connectToDatabase();
    const office = await Office.findOne({ pin: officePin }).lean();
    if (!office) return null;

    return {
        officeName: office.name,
        email: office.email,
        officeTime: office.settings?.officeTime || '9:00 AM - 6:00 PM',
        isOnline: office.settings?.isOnline ?? true
    };
}
