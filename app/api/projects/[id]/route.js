import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';

export async function GET(request, { params }) {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;
        const { id } = await params;

        if (!officePin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const project = await Project.findOne({ id: id, officeId: officePin }).lean();

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Fetch associated tasks
        const tasks = await Task.find({
            officeId: officePin,
            projectId: id
        }).sort({ order: 1, createdAt: -1 }).lean();

        // Build task tree
        function buildTaskTree(taskList, parentId = null) {
            return taskList
                .filter(t => t.parentId === parentId)
                .map(t => ({
                    ...t,
                    id: t.id || t._id.toString(),
                    subtasks: buildTaskTree(taskList, t.id || t._id.toString())
                }));
        }

        const projectWithTasks = {
            ...project,
            id: project.id || project._id.toString(),
            tasks: buildTaskTree(tasks, null)
        };

        return NextResponse.json(projectWithTasks);
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;
        const { id } = await params;

        if (!officePin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { _id, ...updateData } = body;

        const updatedProject = await Project.findOneAndUpdate(
            { id: id, officeId: officePin },
            updateData,
            { new: true }
        );

        if (!updatedProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
