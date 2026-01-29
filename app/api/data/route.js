import { promises as fs } from 'fs';
import path from 'path';
import connectToDatabase from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';

const dataFilePath = path.join(process.cwd(), 'data', 'data.json');

// Helper to flatten task tree for DB insertion
function flattenTasks(tasks, projectId, parentId = null) {
    let flat = [];
    tasks.forEach(t => {
        const { subtasks, ...taskData } = t;
        const taskDoc = {
            ...taskData,
            projectId,
            parentId
        };
        flat.push(taskDoc);
        if (subtasks && subtasks.length > 0) {
            flat = flat.concat(flattenTasks(subtasks, projectId, t.id));
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
            // Recursively find subtasks. 
            // Note: This naive 0(N^2) approach is fine for <1000 items. 
            // For larger, we'd map by parentId first.
            subtasks: buildTaskTree(tasks, t.id)
        }));
}

export async function GET() {
    try {
        await connectToDatabase();

        // 1. Auto-Migration Check
        const projectCount = await Project.countDocuments();

        if (projectCount === 0) {
            try {
                console.log("DB empty, migrating from data.json to Normalized Schema...");
                const fileContents = await fs.readFile(dataFilePath, 'utf8');
                const jsonData = JSON.parse(fileContents);

                if (jsonData.projects) {
                    // Insert Projects
                    const projectsToInsert = jsonData.projects.map(p => {
                        const { tasks, ...rest } = p;
                        return rest;
                    });
                    await Project.insertMany(projectsToInsert);

                    // Insert Tasks (Flattened)
                    let allTasks = [];
                    jsonData.projects.forEach(p => {
                        if (p.tasks) {
                            allTasks = allTasks.concat(flattenTasks(p.tasks, p.id));
                        }
                    });
                    if (allTasks.length > 0) {
                        await Task.insertMany(allTasks);
                    }
                }
                return Response.json(jsonData);
            } catch (err) {
                if (err.code === 'ENOENT') {
                    console.log("No data.json found. Starting with empty DB.");
                    return Response.json({ projects: [], sprints: [] });
                }
                throw err;
            }
        }

        // 2. Fetch Data
        const projects = await Project.find({}).lean();
        const allTasks = await Task.find({}).lean();

        // 3. Reconstruct Tree
        // Clean _id and __v
        const cleanProjects = projects.map(p => {
            const { _id, __v, ...rest } = p;
            return rest;
        });

        const cleanTasks = allTasks.map(t => {
            const { _id, __v, projectId, parentId, ...rest } = t;
            // We keep internal fields for reconstruction logic, but usually frontend needs 'id'
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

        // Return expected format (sprints empty or removed if frontend tolerates)
        // Frontend likely checks data.sprints, so we return empty array to be safe.
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
        const newData = await request.json();

        // 1. Upsert Projects
        // To strictly sync: Delete All -> Insert All is simplest and safest for consistency
        // as implemented before.
        if (newData.projects) {
            // Transaction-like sequence
            await Project.deleteMany({});
            await Task.deleteMany({});

            const projectsToInsert = newData.projects.map(p => {
                const { tasks, ...rest } = p;
                return rest;
            });
            await Project.insertMany(projectsToInsert);

            let allTasks = [];
            newData.projects.forEach(p => {
                if (p.tasks) {
                    allTasks = allTasks.concat(flattenTasks(p.tasks, p.id));
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
