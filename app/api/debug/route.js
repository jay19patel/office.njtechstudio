import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Project from '@/models/Project';

export async function GET(request) {
    try {
        await connectToDatabase();
        const officeId = request.headers.get('x-office-id') || 'default-office';

        // Fetch ALL projects without filtering
        const allProjects = await Project.find({});

        return NextResponse.json({
            count: allProjects.length,
            requestedOfficeId: officeId,
            projects: allProjects
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
