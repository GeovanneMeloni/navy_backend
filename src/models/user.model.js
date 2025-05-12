import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    login: { type: Boolean, default: false},
    active: { type: Boolean, default: true },
    type: { type: String, required: true },
});

export default mongoose.model('User', UserSchema);