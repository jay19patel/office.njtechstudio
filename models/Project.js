
import mongoose from 'mongoose';

// Recursive Subtask Schema
const SubtaskSchema = new mongoose.Schema();
SubtaskSchema.add({
    id: { type: String, required: true },
    title: String,
    type: String, // 'Task', 'Story', 'Bug', 'Epic'
    status: String,
    startDate: String,
    endDate: String,
    assigneeId: { type: String, default: null },
    sprintId: { type: String, default: null },
    description: { type: String, default: "" },
    estimatedHours: { type: String, default: "" },
    subtasks: [SubtaskSchema] // Recursive definition
});

const ProjectSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    officeId: { type: String, required: true, index: true },
    title: String,
    description: String,
    status: String,
    startDate: String,
    endDate: String
    // Tasks are now in a separate collection, linked by projectId
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
