import { NextResponse } from 'next/server';
import { getOfficeData } from '@/lib/data-service';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;

        if (!officePin) {
            return NextResponse.json({ projects: [] });
        }

        const data = await getOfficeData(officePin);

        return NextResponse.json({ projects: data.projects });

    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Helper to flatten task tree
function flattenTasks(tasks, projectId, parentId = null, officeId) {
    let flat = [];
    tasks.forEach(t => {
        const { subtasks, id: tempId, ...taskData } = t;
        const taskDoc = {
            ...taskData,
            projectId,
            parentId,
            officeId
        };
        flat.push({ doc: taskDoc, tempId, subtasks });
    });
    return flat;
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;

        if (!officePin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { tasks = [], ...projectData } = body;

        // Create Project
        const projectId = projectData.id || `p${Date.now()}`;

        const project = await Project.create({
            ...projectData,
            id: projectId,
            officeId: officePin
        });

        // Recursive function to insert tasks
        const insertTasks = async (taskList, parentId = null) => {
            for (const task of taskList) {
                const { subtasks, id: tempId, ...taskData } = task;

                // Ensure task has an ID
                const taskId = tempId && !tempId.startsWith('t') ? tempId : `t${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                const newTask = await Task.create({
                    ...taskData,
                    id: taskId,
                    projectId: project.id, // Use custom string ID
                    parentId: parentId, // Use custom string ID
                    officeId: officePin
                });

                if (subtasks && subtasks.length > 0) {
                    await insertTasks(subtasks, newTask.id);
                }
            }
        };

        if (tasks && tasks.length > 0) {
            await insertTasks(tasks, null);
        }

        return NextResponse.json({ success: true, project });

    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}
