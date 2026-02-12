import { getOfficeData } from '@/lib/data-service';
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


export async function GET() {
    try {
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;

        const data = await getOfficeData(officePin);
        return Response.json(data);

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
