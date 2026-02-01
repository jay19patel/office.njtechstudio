
import mongoose from 'mongoose';

const DailyPlanSchema = new mongoose.Schema({
    date: { type: String, required: true }, // Format: YYYY-MM-DD - Removed unique to allow multiple stories per day? User said "meri story ban jaye". Usually day plan is unique. But if titled, maybe multiple? Plan says "Story will now be a saved plan with a Title". If user wants "Story" -> maybe allows multiple. But usually one daily plan. Let's keep unique date for "Daily Plan" semantics or relax it?
    // User request: "niche date and story title add karu and save karne pe meri story ban jaye and muje list me story ka title dikhe"
    // This implies multiple stories could exist, or at least they are distinct entities.
    // If I relax unique, I can have multiple stories per date. Let's relax unique for now as it's "Story" not just "Daily Routine".
    title: { type: String, default: "" },
    officeId: { type: String, required: true, index: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
}, { timestamps: true });

export default mongoose.models.DailyPlan || mongoose.model('DailyPlan', DailyPlanSchema);
