
import connectToDatabase from '@/lib/db';
import Note from '@/models/Note';

export async function GET(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');

        let query = {};
        if (q) {
            query = {
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { content: { $regex: q, $options: 'i' } },
                ]
            };
        }

        const notes = await Note.find(query).sort({ updatedAt: -1 });
        return Response.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        return Response.json({ error: error.message || 'Failed to fetch notes' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        if (!body.title) {
            return Response.json({ error: 'Title is required' }, { status: 400 });
        }

        const note = await Note.create(body);
        return Response.json(note, { status: 201 });
    } catch (error) {
        console.error("Error creating note:", error);
        return Response.json({ error: error.message || 'Failed to create note' }, { status: 500 });
    }
}
