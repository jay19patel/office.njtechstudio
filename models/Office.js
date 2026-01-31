import mongoose from 'mongoose';

const OfficeSchema = new mongoose.Schema({
    pin: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        default: 'My Office',
    },
    email: {
        type: String,
        default: '',
    },
    settings: {
        officeTime: { type: String, default: '9:00 AM - 6:00 PM' },
        isOnline: { type: Boolean, default: true },
    }
}, {
    timestamps: true,
});

export default mongoose.models.Office || mongoose.model('Office', OfficeSchema);
