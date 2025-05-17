import e from "express";
import helmet from "helmet";
import cors from "cors"
import mongoose from "mongoose";
import initRoutes from "./routes/index.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";


const app = e();
mongoose.connect(process.env.MONGO_URI!)
.catch(err => console.error('Erro ao conectar no MongoDB:', err));

app.use(helmet());
app.use(e.json());
app.use(cors())

app.use("/api", initRoutes);

app.use(errorHandler);

app.listen(3000, () => console.log("Executando na porta 3000"));