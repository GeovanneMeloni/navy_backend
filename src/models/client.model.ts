import mongoose, { Schema } from "mongoose";

const addressSchema = new mongoose.Schema({
    cep: { type: String, require: true, maxLength: 8 },
    rua: { type: String, require: true },
    numero: { type: Number, require: true },
    logradouro: { type: String, require: true },
    estado: { type: String, require: true },
    municipio: { type: String, require: true },
    complemento: { type: String, require: false },
    tipoEndereco: { type: String, require: true },
});

const clientSchema = new mongoose.Schema({
    rg: { type: String, required: true, maxLength: 10 },
    cpf: { type: String, required: true, maxLength: 11 },
    cnh: { type: String, required: true, maxLength: 9 },
    active: { type: Boolean, default: true },
    type: { type: String, required: true },
    address: addressSchema,
    gender: { type: String, required: false }, // masculino ou feminino
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export type ClientType = mongoose.InferSchemaType<typeof clientSchema>;

export default mongoose.model("Client", clientSchema);
