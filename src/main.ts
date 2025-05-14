import e, {Request, Response} from "express";
import mongoose from "mongoose";
import initRoutes from "./routes/index.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";

const app = e();

mongoose.connect(process.env.MONGO_URI!)
.catch(err => console.error('Erro ao conectar no MongoDB:', err));

app.use(e.json());

app.use("/api", initRoutes)

app.use(errorHandler)

app.listen(3000, () => console.log("Executando na porta 3000"));