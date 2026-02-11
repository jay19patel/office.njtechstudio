
import { getNotes } from '@/lib/data-service';
import connectToDatabase from '@/lib/db';
import Note from '@/models/Note';
import { cookies } from 'next/headers';

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;

        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q') || '';

        const notes = await getNotes(officePin, q);
        return Response.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        return Response.json({ error: error.message || 'Failed to fetch notes' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        const officePin = cookieStore.get('officePin')?.value;

        if (!officePin) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        if (!body.title) {
            return Response.json({ error: 'Title is required' }, { status: 400 });
        }

        const note = await Note.create({ ...body, officeId: officePin });
        return Response.json(note, { status: 201 });
    } catch (error) {
        console.error("Error creating note:", error);
        return Response.json({ error: error.message || 'Failed to create note' }, { status: 500 });
    }
}
