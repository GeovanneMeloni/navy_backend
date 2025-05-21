import { Schema, model } from "mongoose";

// Frota
const FleetSchema = new Schema(
    {
        group: { type: String, required: true }, // Grupo do carro (ex: Econômico, SUV)
        model: { type: String, required: true }, // Modelo do carro (ex: Corolla, Onix)
        brand: { type: String, required: true }, // Marca (ex: Toyota, Chevrolet)
        year: { type: Number, required: true }, // Ano de fabricação
        color: { type: String, required: true }, // Cor do carro
        price: { type: Number, required: true }, // Preço de venda
        pricePerHour: { type: Number, required: true }, // Preço por hora (para aluguel)
        fuelType: { type: String, required: true }, // Tipo de combustível (ex: Gasolina, Etanol)
        licensePlate: { type: String, required: true, unique: true }, // Placa do veículo
        photoUrl: { type: String, required: false }, // URL da imagem do veículo
    },
    {
        timestamps: true, // cria automaticamente createdAt e updatedAt
    }
);

export const Fleet = model("Fleet", FleetSchema);
