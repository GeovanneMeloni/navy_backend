// src/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Navy Backend API",
            version: "1.4.0",
            description: "API para venda e aluguel de carros",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: "https://navy-backend.onrender.com/", // Altere para sua URL real
            },
            {
                url: "http://localhost:3000", // Altere para sua URL real
            },
        ],
    },
    apis: [
        "./src/routes/*.ts",
        "./src/controllers/*.ts",
        "./src/models/*.ts",
        "./src/docs/schemas/*.yaml",
    ],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
