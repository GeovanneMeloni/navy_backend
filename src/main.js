import e from "express";
import mongoose from "mongoose";
import initRoutes from "./routes/index.js";

const app = e();
app.use(e.json())
app.use(e.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

app.get("/", (req, res) => {
    res.send({message: "Oiiii"})
})
app.use("/api", initRoutes)

app.listen(3000, () => console.log("Executando na porta 3000"));