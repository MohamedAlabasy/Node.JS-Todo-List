import mongoose from 'mongoose';
import { AutoIncrementID } from '@typegoose/auto-increment';

const schema = new mongoose.Schema({
    _id: Number,
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['high', 'medium', 'low'] },
    status: { type: String, enum: ['in_progress', 'under_review', 'rework', 'completed'], default: 'in_progress' },
    start_date: { type: Date, required: true, default: Date.now },
    end_date: { type: Date, required: true },
    user: { type: Number, ref: 'users' }
}, { timestamps: true });

schema.plugin(AutoIncrementID, [{ filed: '_id' }]);

export default mongoose.model('todo_lists', schema)