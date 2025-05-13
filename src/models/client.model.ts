import mongoose, { Schema } from "mongoose";

const addressSchema = new mongoose.Schema({
    rua: { type: String, require: true },
    numero: { type: Number, require: true },
    logradouro: { type: String, require: true },
    cep: { type: String, require: true, maxLength: 8 },
    estado: { type: String, require: true },
    municipio: { type: String, require: true },
    tipoEndereco: { type: String, require: true }
})

const clientSchema = new mongoose.Schema({
    rg: { type: String, required: true, maxLength: 10 },
    cpf: { type: String, required: true, maxLength: 11 },
    cnh: { type: String, required: true, maxLength: 9 },
    active: { type: Boolean, default: true },
    type: { type: String, required: true },
    address: addressSchema
})

export default mongoose.model('Client', clientSchema);