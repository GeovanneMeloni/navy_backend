import mongoose, { Document, Schema } from "mongoose";

export interface IPurchaseLog extends Document {
    car: mongoose.Types.ObjectId;
    buyer: mongoose.Types.ObjectId;
    seller: mongoose.Types.ObjectId;
    purchaseDate: Date;
    status: "completed" | "canceled";
    cancellationDate?: Date;
}

const PurchaseLogSchema: Schema = new Schema(
    {
        car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
        buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
        seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
        purchaseDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ["completed", "canceled"],
            required: true,
        },
        cancellationDate: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model<IPurchaseLog>("PurchaseLog", PurchaseLogSchema);