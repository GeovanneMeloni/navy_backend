import mongoose, { Schema } from "mongoose";

const carSchema = new mongoose.Schema({
    value: { type: Number, required: true },
    amount: { type: Number, required: true },
    car_info: { type: String },
    active: { type: Boolean, default: true },
    seller_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export type CarType = mongoose.InferSchemaType<typeof carSchema>;

export default mongoose.model("Car", carSchema);
