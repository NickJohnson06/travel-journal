import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, minlength: 3, trim: true },
    passwordHash: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);