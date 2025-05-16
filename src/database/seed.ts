// src/seed.ts
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User, { UserType } from "../models/user.model";
import Client, { ClientType } from "../models/client.model";
import Car, { CarType } from "../models/cars.model";
import { faker } from "@faker-js/faker/locale/pt_BR";

const MONGO_URI = process.env.MONGO_URI!;
console.log("Conectando em: ", MONGO_URI);

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conectado ao MongoDB");

        // Limpa coleções
        await User.deleteMany({});
        await Client.deleteMany({});
        await Car.deleteMany({});

        // Usuários
        const users: UserType[] = [];
        for (let i = 0; i < 3; i++) {
            const userData = await createFakeUser();
            const createdUser = await User.create(userData);

            users.push(createdUser);
        }

        // Clientes
        const clients: ClientType[] = [];
        for (let i = 0; i < 5; i++) {
            const clientData = createFakeClient();
            const createdClient = await Client.create(clientData);

            clients.push(createdClient);
        }

        // Carros
        const cars: CarType[] = [];

        for (let i = 0; i < 8; i++) {
            const carData = createFakeCar(users);
            const createdCar = await Car.create(carData);

            cars.push(createdCar);
        }

        console.log("Seed concluído com sucesso!");
    } catch (err) {
        console.error("Erro ao executar seed:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

// Função que retorna um objeto de usuário fake
async function createFakeUser() {
    const password = await bcrypt.hash("senha123", 10);
    return {
        email: faker.internet.email(),
        password,
        login: false,
        active: true,
        role: faker.helpers.arrayElement(["admin", "seller", "buyer"]),
    };
}

// Função que retorna um objeto de cliente fake
function createFakeClient() {
    return {
        rg: faker.string.numeric({ length: 9 }),
        cpf: faker.string.numeric({ length: 11 }),
        cnh: faker.string.numeric({ length: 9 }),
        active: true,
        type: faker.helpers.arrayElement(["comprador", "locatario"]),
        address: {
            rua: faker.location.street(),
            numero: faker.number.int({ min: 1, max: 9999 }),
            logradouro: faker.location.secondaryAddress(),
            cep: faker.location.zipCode("########"),
            estado: faker.location.state(),
            municipio: faker.location.city(),
            tipoEndereco: faker.helpers.arrayElement([
                "Residencial",
                "Comercial",
            ]),
        },
    };
}

// Função que retorna um objeto de carro fake
function createFakeCar(users: any[]) {
    return {
        value: faker.number.int({ min: 30000, max: 200000 }),
        amount: faker.number.int({ min: 1, max: 10 }),
        car_info: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()} ${faker.number.int(
            { min: 2015, max: 2024 }
        )}`,
        active: true,
        seller_id:
            users[
                faker.number.int({ min: 0, max: users.length - 1 })
            ]._id.toString(),
    };
}

seed();
