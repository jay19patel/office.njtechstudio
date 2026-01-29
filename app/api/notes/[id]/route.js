
import connectToDatabase from '@/lib/db';
import Note from '@/models/Note';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const note = await Note.findById(id);

        if (!note) {
            return Response.json({ error: 'Note not found' }, { status: 404 });
        }

        return Response.json(note);
    } catch (error) {
        return Response.json({ error: 'Failed to fetch note' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const body = await request.json();

        const note = await Note.findByIdAndUpdate(id, body, { new: true });

        if (!note) {
            return Response.json({ error: 'Note not found' }, { status: 404 });
        }

        return Response.json(note);
    } catch (error) {
        console.error("Error updating note:", error);
        return Response.json({ error: error.message || 'Failed to update note' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const note = await Note.findByIdAndDelete(id);

        if (!note) {
            return Response.json({ error: 'Note not found' }, { status: 404 });
        }

        return Response.json({ message: 'Note deleted' });
    } catch (error) {
        console.error("Error deleting note:", error);
        return Response.json({ error: error.message || 'Failed to delete note' }, { status: 500 });
    }
}
