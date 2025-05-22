import { Schema } from "mongoose";

// Subschema: Detalhes do carro
export const CarDetailsSchema = new Schema(
    {
        group: { type: String, required: false }, // Grupo do carro (ex: Econômico, SUV)
        model: { type: String, required: true }, // Modelo do carro (ex: Corolla, Onix)
        brand: { type: String, required: true }, // Marca (ex: Toyota, Chevrolet)
        year: { type: Number, required: true }, // Ano de fabricação
        color: { type: String, required: true }, // Cor do carro
        fuel_type: { type: String, required: false }, // Tipo de combustível (ex: Gasolina, Etanol)
        transmission: { type: String, required: false }, // Automático / Manual
    },
    {
        _id: false,
        versionKey: false,
    }
);
