import mongoose, { Schema } from "mongoose";

const SellerSchema = new Schema({
    rg: String,
    cpf: String,
    foto: String,
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export type CarType = mongoose.InferSchemaType<typeof SellerSchema>;

export default mongoose.model("Seller", SellerSchema);
