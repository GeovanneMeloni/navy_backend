import rateLimit from "express-rate-limit";

const apiRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 500, // Limite de 500 requisições por IP
    message: {
        error: "Too many requests, please try again later.",
    },
    standardHeaders: true, // Retorna informações de limite de taxa nos cabeçalhos
    legacyHeaders: false, // Desativa os cabeçalhos antigos
});

export { apiRateLimiter };
