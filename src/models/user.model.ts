import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v: string) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
            },
            message: (props) => `${props.value} não é um e-mail válido!`,
        },
    },
    password: { type: String, required: true },
    login: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    role: { type: String, required: true },
});

export type UserType = mongoose.InferSchemaType<typeof UserSchema>;

export default mongoose.model("User", UserSchema);
