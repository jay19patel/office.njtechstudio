import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Task from '@/models/Task';

export async function GET(request) {
    try {
        await connectToDatabase();

        // Fetch ALL tasks to inspect structure
        const tasks = await Task.find({}).limit(10).lean();

        return NextResponse.json({
            count: tasks.length,
            tasks: tasks.map(t => ({
                id: t.id,
                title: t.title,
                type: t.type,
                projectId: t.projectId, // This is what we need to verify
                parentId: t.parentId
            }))
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
