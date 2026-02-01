
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import TimeLog from '@/models/TimeLog';
import Task from '@/models/Task';

// POST: Start or Stop a timer
export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { action, taskId, remarks, date } = body; // action: 'start' | 'stop'
        const officeId = request.headers.get('x-office-id') || 'default-office';

        if (!taskId || !action) {
            return NextResponse.json({ error: 'TaskID and Action are required' }, { status: 400 });
        }

        if (action === 'start') {
            // 1. Create a new TimeLog entry
            // 2. Update Task status to 'In Progress'

            // Check if there's already a running timer for this user/office? 
            // Ideally yes, but for now let's just create it. 
            // Realistically we might want to auto-stop others, but let's stick to basic requirement first.

            const newLog = new TimeLog({
                taskId,
                officeId,
                date: date || new Date().toISOString().split('T')[0],
                startTime: new Date(),
            });
            await newLog.save();

            // Update Task Status
            await Task.findByIdAndUpdate(taskId, { status: 'In Progress' });

            return NextResponse.json({ success: true, data: newLog });

        } else if (action === 'stop') {
            // 1. Find the latest running TimeLog for this task (endTime is null)
            // 2. Update endTime and remarks

            const log = await TimeLog.findOne({
                taskId,
                officeId,
                endTime: { $exists: false } // Check for running logs
            }).sort({ startTime: -1 });

            if (!log) {
                return NextResponse.json({ error: 'No active timer found for this task' }, { status: 404 });
            }

            log.endTime = new Date();
            if (remarks) log.remarks = remarks;

            await log.save();

            // Optionally ask user if task is done? Client side can handle that. 
            // Here just stop.

            return NextResponse.json({ success: true, data: log });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error("Error in time logging:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
