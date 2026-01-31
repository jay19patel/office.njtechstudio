import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    officeId: {
        type: String,
        required: true,
        unique: true,
    },
    officeName: {
        type: String,
        default: 'My Office',
    },
    email: {
        type: String,
        default: '',
    },
    officeTime: {
        type: String,
        default: '9:00 AM - 6:00 PM',
    },
    isOnline: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
