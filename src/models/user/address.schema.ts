import { Schema } from "mongoose";

// Subschema de endereço
export const AddressSchema = new Schema(
    {
        cep: { type: String, required: true, maxLength: 9 },
        rua: { type: String, required: true },
        numero: { type: String, required: true }, // numero pode ser string, pois pode conter letras (ex: 123A)
        logradouro: { type: String, required: true },
        estado: { type: String, required: true },
        municipio: { type: String, required: true },
        complemento: { type: String, required: false },
        tipoEndereco: { type: String, required: false },
    },
    {
        _id: false,
        versionKey: false,
    }
);
