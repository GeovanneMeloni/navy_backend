import { InferSchemaType, Schema, model } from "mongoose";
import { CarDetailsSchema } from "./carDetails.schema";
// Carros disponíveis para venda ou aluguel / Frota
const CarSchema = new Schema(
    {
        price: { type: Number, required: false }, // Preço de venda
        price_per_hour: { type: Number, required: false }, // Preço por hora (aluguel)
        license_plate: { type: String, required: false, unique: false }, // Placa do carro
        photo: { type: Buffer, required: false },
        is_available: { type: Boolean, default: true },
        is_sold: { type: Boolean, default: false },
        rented_at: { type: Date, default: null, required: false }, // Data de aluguel
        sold_at: { type: Date, default: null, required: false }, // Data de venda
        short_description: { type: String, required: true }, // Autogerado
        details: { type: CarDetailsSchema, required: true },
        mileage: { type: Number, required: false }, // Quilometragem

        seller_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        renter_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
    },
    { timestamps: true, versionKey: false }
);

export type CarType = InferSchemaType<typeof CarSchema>;

export const Car = model("Car", CarSchema);
