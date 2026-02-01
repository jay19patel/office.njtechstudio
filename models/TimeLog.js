
import mongoose from 'mongoose';

const TimeLogSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    officeId: { type: String, required: true, index: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    remarks: { type: String, default: "" }
}, { timestamps: true });

TimeLogSchema.index({ taskId: 1, date: 1 });
TimeLogSchema.index({ officeId: 1, date: 1 });

export default mongoose.models.TimeLog || mongoose.model('TimeLog', TimeLogSchema);
