import e from "express";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import initRoutes from "./routes/index";
import { errorHandler } from "./middlewares/errorHandler";
import { setupSwagger } from "./docs/swagger";
import { apiRateLimiter } from "./security/apiRateLimiter";

const app = e();
mongoose
    .connect(process.env.MONGO_URI!)
    .catch((err) => console.error("Erro ao conectar no MongoDB:", err));

app.use(e.json());
app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "script-src": ["'self'", "'unsafe-inline'"],
                "style-src": ["'self'", "'unsafe-inline'"],
                "img-src": ["'self'", "data:", "res.cloudinary.com", "validator.swagger.io"],
                "connect-src": ["'self'", "https://navy-backend.onrender.com"],
            },
        },
    })
);
app.use(cors());

app.use(apiRateLimiter);

app.use("/api", initRoutes);

setupSwagger(app);

app.use(errorHandler);

app.listen(3000, () => {
    console.log(`Executando na porta: http://localhost:3000/api`);
    console.log(`Swagger disponível em: http://localhost:3000/swagger`);
});
