import mongoose, { model, Schema } from "mongoose";
import { UserProfileSchema } from "./userProfile.schema";

const UserSchema = new Schema(
    {
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
        role: {
            type: String,
            required: true,
            enum: ["buyer", "seller", "admin"],
        },
        user_profile: { type: UserProfileSchema, required: false },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export type UserType = mongoose.InferSchemaType<typeof UserSchema>;

export const User = model("User", UserSchema);
