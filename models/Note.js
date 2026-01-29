
import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String, // Stores HTML from rich text editor
        default: '',
    },
    tags: [String],
}, {
    timestamps: true,
});

// Check if the model exists and delete it to prevent stale schema/hooks in development
if (mongoose.models.Note) {
    delete mongoose.models.Note;
}

export default mongoose.model('Note', NoteSchema);
