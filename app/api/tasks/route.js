
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Task from '@/models/Task';
import Project from '@/models/Project';

export async function GET(request) {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        // Fallback or use header, but consistency suggests cookie
        const officePin = cookieStore.get('officePin')?.value || request.headers.get('x-office-id');

        if (!officePin) return NextResponse.json({ projects: [] });

        // 1. Fetch Active Projects
        const projects = await Project.find({
            officeId: officePin,
            status: { $ne: 'Completed' }
        }).sort({ createdAt: -1 }).lean();

        const projectCustomIds = projects.map(p => p.id || p._id.toString());

        // 2. Fetch Active Tasks
        const tasks = await Task.find({
            officeId: officePin,
            projectId: { $in: projectCustomIds },
            status: { $ne: 'Completed' }
        }).sort({ order: 1, createdAt: -1 }).lean();

        // 3. Attach tasks to projects
        const projectsWithTasks = projects.map(p => {
            const pid = p.id || p._id.toString();
            const pTasks = tasks.filter(t => t.projectId === pid);

            return {
                ...p,
                id: pid,
                _id: p._id.toString(),
                tasks: buildTaskTree(pTasks, null)
            };
        });

        function buildTaskTree(taskList, parentId = null) {
            return taskList
                .filter(t => t.parentId === parentId)
                .map(t => ({
                    ...t,
                    id: t.id || t._id.toString(),
                    subtasks: buildTaskTree(taskList, t.id || t._id.toString())
                }));
        }

        return NextResponse.json({ projects: projectsWithTasks });

    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
