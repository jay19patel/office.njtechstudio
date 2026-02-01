import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import DailyPlan from '@/models/DailyPlan';
import Task from '@/models/Task'; // Populate tasks

// GET: Fetch all sprints
export async function GET(request) {
    try {
        await connectToDatabase();

        // Fetch all plans/sprints, sorted by date (newest first)
        const sprints = await DailyPlan.find({})
            .sort({ date: -1, createdAt: -1 })
            .populate('tasks');

        return NextResponse.json({ sprints });
    } catch (error) {
        console.error("Error fetching sprints:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Create a new Sprint
export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { title, date, taskIds } = body;
        const officeId = request.headers.get('x-office-id') || 'default-office';

        if (!title || !date) {
            return NextResponse.json({ error: 'Title and Date are required' }, { status: 400 });
        }

        // Check for existing sprint on this date
        const existingSprint = await DailyPlan.findOne({ date });
        if (existingSprint) {
            return NextResponse.json({ error: 'A sprint already exists for this date.' }, { status: 400 });
        }

        const newSprint = new DailyPlan({
            officeId,
            title,
            date,
            tasks: taskIds || []
        });

        await newSprint.save();

        return NextResponse.json({ success: true, sprint: newSprint });

    } catch (error) {
        console.error("Error creating sprint:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE: Delete a Sprint
export async function DELETE(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Sprint ID is required' }, { status: 400 });
        }

        await DailyPlan.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Sprint deleted successfully' });
    } catch (error) {
        console.error("Error deleting sprint:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
