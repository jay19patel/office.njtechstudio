
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import DailyPlan from '@/models/DailyPlan';
import Task from '@/models/Task';
import TimeLog from '@/models/TimeLog';

// GET: Fetch daily plan for a specific date
export async function GET(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const officeId = request.headers.get('x-office-id') || 'default-office'; // Assuming header or default

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        // Find the plan for the date
        const plan = await DailyPlan.findOne({ date, officeId })
            .populate('tasks')
            .lean();

        if (!plan) {
            return NextResponse.json({ date, tasks: [] });
        }

        // Fetch time logs for these tasks on this date
        // Logic: For each task in the plan, get the total time spent today
        // Actually, the UI might want detailed logs. Let's just return the tasks and let the UI fetch stats or include basic stats here.
        // Better: Include "todaysTimeLogs" for each task.

        const taskIds = plan.tasks.map(t => t._id);
        const timeLogs = await TimeLog.find({
            taskId: { $in: taskIds },
            date: date,
            officeId: officeId
        }).lean();

        // Attach logs to tasks
        const tasksWithLogs = plan.tasks.map(task => {
            const logs = timeLogs.filter(l => l.taskId.toString() === task._id.toString());
            return { ...task, timeLogs: logs };
        });

        return NextResponse.json({ ...plan, tasks: tasksWithLogs });

    } catch (error) {
        console.error("Error fetching daily plan:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Add task(s) to the daily plan
export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { date, taskId, taskIds } = body;
        const officeId = request.headers.get('x-office-id') || 'default-office';

        const idsToAdd = [];
        if (taskIds && Array.isArray(taskIds)) {
            idsToAdd.push(...taskIds);
        } else if (taskId) {
            idsToAdd.push(taskId);
        }

        if (!date || idsToAdd.length === 0) {
            return NextResponse.json({ error: 'Date and Task ID(s) are required' }, { status: 400 });
        }

        // Validate all tasks exist (optional but good) - skipping for speed/simplicity or assume valid IDs
        // Actually, let's just trust valid IDs for now or fetch them.

        // Find or Create DailyPlan
        let plan = await DailyPlan.findOne({ date, officeId });

        if (!plan) {
            plan = new DailyPlan({ date, officeId, tasks: idsToAdd });
        } else {
            // Check if task already exists
            idsToAdd.forEach(id => {
                if (!plan.tasks.includes(id)) {
                    plan.tasks.push(id);
                }
            });
        }

        await plan.save();

        return NextResponse.json({ success: true, message: 'Tasks added to daily plan' });

    } catch (error) {
        console.error("Error adding task to daily plan:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE: Remove a task from the daily plan
export async function DELETE(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const taskId = searchParams.get('taskId');
        const officeId = request.headers.get('x-office-id') || 'default-office';

        if (!date || !taskId) {
            return NextResponse.json({ error: 'Date and Task ID are required' }, { status: 400 });
        }

        await DailyPlan.findOneAndUpdate(
            { date, officeId },
            { $pull: { tasks: taskId } }
        );

        return NextResponse.json({ success: true, message: 'Task removed from daily plan' });

    } catch (error) {
        console.error("Error removing task from daily plan:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
