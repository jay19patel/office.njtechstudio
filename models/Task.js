
import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: String,
    type: String, // 'Task', 'Story', 'Bug', 'Epic'
    status: String,
    startDate: String,
    endDate: String,
    assigneeId: { type: String, default: null },
    description: { type: String, default: "" },
    estimatedHours: { type: String, default: "" },
    projectId: { type: String, ref: 'Project', required: true, index: true },
    parentId: { type: String, default: null, index: true }, // For subtasks
    order: { type: Number, default: 0 }
});

// Compound index for fast lookup of project tree
TaskSchema.index({ projectId: 1, parentId: 1 });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
