import mongoose from 'mongoose';
import { AutoIncrementID } from '@typegoose/auto-increment';

const schema = new mongoose.Schema({
    _id: Number,
    name: { type: String, require: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false, required: true, trim: true },
    is_verification: { type: Boolean, required: true, default: false, trim: true },
    token: { type: String, required: false, select: false, default: '' },
}, { timestamps: true });

schema.plugin(AutoIncrementID, [{ filed: '_id' }]);

export default mongoose.model('users', schema);

