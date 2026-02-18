import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import Task from '@/models/Task';

export async function GET(request, { params }) {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;
        const { taskId } = await params;

        if (!officePin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const task = await Task.findOne({ id: taskId, officeId: officePin });

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("Error fetching task:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;
        const { taskId } = await params;

        if (!officePin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { _id, ...updateData } = body;

        const updatedTask = await Task.findOneAndUpdate(
            { id: taskId, officeId: officePin },
            updateData,
            { new: true }
        );

        if (!updatedTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
