import mongoose from 'mongoose';
import { AutoIncrementID } from '@typegoose/auto-increment';

const schema = new mongoose.Schema({
    _id: Number,
    code: { type: String, required: true, trim: true },
    created_at: { type: Date, required: true, default: Date.now },
    expire_at: { type: Date, required: true },
    user: { type: Number, ref: 'users' }
}, { timestamps: true });

schema.plugin(AutoIncrementID, [{ filed: '_id' }]);

export default mongoose.model('email_verification', schema);

