
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Task from '@/models/Task';
import Project from '@/models/Project';

export async function GET(request) {
    try {
        await connectToDatabase();
        const officeId = request.headers.get('x-office-id') || 'default-office';

        // 1. Fetch Active Projects (not Completed)
        // User said: "jisnte bhi projesct complated nahi he sab dikhe"
        // Using regex for case-insensitive check to be safer.
        const projects = await Project.find({
            status: { $not: /^completed$/i }
        }).sort({ createdAt: -1 }).lean();

        console.log(`Found ${projects.length} active projects for office ${officeId}`);

        // 2. Fetch Tasks for these projects
        // We also want to exclude completed tasks? User said "uske chile me task dikhe". 
        // Typically in daily planning you might want to pick from todo/progress. 
        // Let's exclude 'Completed' tasks too to declutter.

        // Note: Task.projectId is likely the _id of the project (if using Mongoose refs correctly)
        // OR the custom 'id' field. Let's try matching both to be safe or assuming _id.
        // Given the schemas, it's safer to fetch all tasks for office and filter in memory or filtered query.

        // Note: Tasks use the custom `id` field of the Project (e.g. "p123"), NOT the MongoDB `_id`.
        // Checked via debug: Task.projectId = "p1769926745913", Project.id = "p1769926745913".

        const projectCustomIds = projects.map(p => p.id);

        const tasks = await Task.find({
            projectId: { $in: projectCustomIds },
            status: { $ne: 'Completed' }
        }).sort({ order: 1, createdAt: -1 }).lean();

        // 3. Group Tasks by Project
        const groupedData = projects.map(project => {
            // Match using custom ID
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            return {
                project,
                tasks: projectTasks
            };
        });

        return NextResponse.json({ groupedTasks: groupedData });

    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
