import mongoose from "mongoose";

export async function conn() {
    try {
        return mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        console.log("Erro ao se conectar: ", err);
    }
}