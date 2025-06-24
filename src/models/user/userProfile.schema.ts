import { InferSchemaType, Schema } from "mongoose";
import { AddressSchema } from "./address.schema";

// Subschema de informações pessoais
export const UserProfileSchema = new Schema(
    {
        rg: { type: String, required: true, maxLength: 10 },
        cpf: { type: String, required: true, maxLength: 11 },
        cnh: { type: String, required: false, maxLength: 9 }, // só clientes têm CNH
        foto: { type: String, required: false },
        gender: {
            type: String,
            enum: ["masculino", "feminino"],
            required: false,
        },
        address: { type: AddressSchema, required: false },
        document: { type: String, required: false },
        phone: { type: String, required: true, maxLength: 32 },
        name: { type: String, required: true, maxLength: 256 },
    },
    {
        _id: false,
        versionKey: false,
    }
);

// exportar o tipo
export type UserProfileType = InferSchemaType<typeof UserProfileSchema>;
