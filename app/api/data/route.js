import { promises as fs } from 'fs';
import path from 'path';
import connectToDatabase from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';
import { cookies } from 'next/headers';

// Helper to flatten task tree for DB insertion
function flattenTasks(tasks, projectId, parentId = null, officeId) {
    let flat = [];
    tasks.forEach(t => {
        const { subtasks, ...taskData } = t;
        const taskDoc = {
            ...taskData,
            projectId,
            parentId,
            officeId
        };
        flat.push(taskDoc);
        if (subtasks && subtasks.length > 0) {
            flat = flat.concat(flattenTasks(subtasks, projectId, t.id, officeId));
        }
    });
    return flat;
}

// Helper to reconstruct task tree
function buildTaskTree(tasks, parentId = null) {
    return tasks
        .filter(t => t.parentId === parentId)
        .map(t => ({
            ...t,
            subtasks: buildTaskTree(tasks, t.id)
        }));
}

export async function GET() {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;

        if (!officePin) {
            return Response.json({ projects: [], sprints: [] });
        }

        // 2. Fetch Data Scoped by Office
        const projects = await Project.find({ officeId: officePin }).lean();
        // Fetch tasks that belong to this office (or we could fetch by projectIds, but officeId is safer/easier)
        const allTasks = await Task.find({ officeId: officePin }).lean();

        // 3. Reconstruct Tree
        // Clean _id and __v
        const cleanProjects = projects.map(p => {
            const { _id, __v, officeId, ...rest } = p; // remove officeId from response if strictly needed, or keep it
            return rest;
        });

        const cleanTasks = allTasks.map(t => {
            const { _id, __v, projectId, parentId, officeId, ...rest } = t;
            return {
                ...rest,
                projectId,
                parentId,
                id: t.id
            };
        });

        // Attach tasks to projects
        cleanProjects.forEach(p => {
            // Find root tasks for this project
            const projectTasks = cleanTasks.filter(t => t.projectId === p.id);
            p.tasks = buildTaskTree(projectTasks, null);
        });

        // Return expected format
        return Response.json({
            projects: cleanProjects,
            sprints: []
        });

    } catch (error) {
        console.error("Error reading data:", error);
        return Response.json({ error: error.message || "Failed to load data" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;

        if (!officePin) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const newData = await request.json();

        // 1. Upsert Projects (Scoped to Office)
        if (newData.projects) {
            // Transaction-like sequence for THIS office only
            await Project.deleteMany({ officeId: officePin });
            await Task.deleteMany({ officeId: officePin });

            const projectsToInsert = newData.projects.map(p => {
                const { tasks, ...rest } = p;
                return { ...rest, officeId: officePin };
            });
            await Project.insertMany(projectsToInsert);

            let allTasks = [];
            newData.projects.forEach(p => {
                if (p.tasks) {
                    allTasks = allTasks.concat(flattenTasks(p.tasks, p.id, null, officePin));
                }
            });

            if (allTasks.length > 0) {
                await Task.insertMany(allTasks);
            }
        }

        return Response.json({ success: true, data: newData });
    } catch (error) {
        console.error("Error writing data:", error);
        return Response.json({ error: "Failed to save data" }, { status: 500 });
    }
}
