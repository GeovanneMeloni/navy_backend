import { InferSchemaType, Schema, model } from "mongoose";
import { CarDetailsSchema } from "./carDetails.schema";
import { AddressSchema } from "../user/address.schema";
// Carros disponíveis para venda ou aluguel / Frota
export const CarSchema = new Schema(
    {
        operationType: {
            type: String,
            required: false,
            enum: ["sale", "rent"],
            description:
                "Tipo de operação: 'sale' para venda, 'rent' para aluguel",
        },
        price: {
            type: Number,
            required: function () {
                return this.operationType === "sale";
            },
            description:
                "Preço de venda. Obrigatório se operationType for 'sale'",
        },
        price_per_hour: {
            type: Number,
            required: function () {
                return this.operationType === "rent";
            },
            description:
                "Preço por hora de aluguel. Obrigatório se operationType for 'rent'",
        },
        license_plate: { type: String, required: true }, // removido unique por preguiça, mas pode ser adicionado se necessário
        photo_url: { type: String, required: false },

        // Status atual do carro: disponível, alugado ou vendido
        status: {
            type: String,
            enum: ["available", "rented", "sold"],
            default: "available",
            description:
                "Estado atual do carro: 'available', 'rented' ou 'sold'",
        },
        rented_at: {
            type: Date,
            default: null,
            description: "Data em que o carro foi alugado (se aplicável)",
        },
        sold_at: {
            type: Date,
            default: null,
            description: "Data em que o carro foi vendido (se aplicável)",
        },

        rented_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: function () {
                return (
                    this.operationType === "rent" && this.status === "rented"
                );
            },
            description: "ID do usuário que alugou o carro (se alugado)",
        },
        sold_to: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: function () {
                return this.operationType === "sale" && this.status === "sold";
            },
            description: "ID do usuário que comprou o carro (se vendido)",
        },

        short_description: {
            type: String,
            required: false,
            description: "Descrição resumida do carro (gerada automaticamente)",
        },
        details: {
            type: CarDetailsSchema,
            required: true,
            description: "Subdocumento com os detalhes técnicos do carro",
        },
        mileage: {
            type: Number,
            required: false,
            description: "Quilometragem atual do carro",
        },

        address: {
            type: AddressSchema,
            required: false,
            description: "Endereço onde o carro está localizado",
        },

        owner_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            description: "ID do proprietário/anunciante do carro",
        },
    },
    { timestamps: true, versionKey: false }
);

export type CarType = InferSchemaType<typeof CarSchema>;

export const Car = model("Car", CarSchema);
