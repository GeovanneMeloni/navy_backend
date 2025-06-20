import { InferSchemaType, Schema } from "mongoose";

// Subschema de localização
const LocationSchema = new Schema(
    {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    {
        _id: false,
        versionKey: false,
    }
);

// Subschema de endereço
export const AddressSchema = new Schema(
    {
        cep: { type: String, required: true, maxLength: 9 },
        rua: { type: String, required: false },
        numero: { type: String, required: false }, // numero pode ser string, pois pode conter letras (ex: 123A)
        logradouro: { type: String, required: false },
        estado: { type: String, required: false },
        municipio: { type: String, required: false },
        complemento: { type: String, required: false },
        tipoEndereco: { type: String, required: false },
        location: { type: LocationSchema, required: false }, // Localização geográfica
    },
    {
        _id: false,
        versionKey: false,
    }
);

export type AddressType = InferSchemaType<typeof AddressSchema>;
