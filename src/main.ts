import e, {Request, Response} from "express";
import mongoose from "mongoose";
import initRoutes from "./routes/index.ts";

const app = e();

mongoose.connect(process.env.MONGO_URI!)
.catch(err => console.error('Erro ao conectar no MongoDB:', err));

app.use(e.json());

app.get("/", (req: Request, res: Response) => {
    res.send({message: "Oiiii"})
})
app.use("/api", initRoutes)

app.listen(3000, () => console.log("Executando na porta 3000"));