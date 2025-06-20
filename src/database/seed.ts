// src/seed.ts
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker/locale/pt_BR";
import { User, UserType } from "../models/user/user.model";
import { Car, CarType } from "../models/car/car.model";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { AddressType } from "../models/user/address.schema";
import { generateShortDescription } from "../utils/car.utils";

const __dirname = dirname(__filename);

const outputFileName = "seed.data.json";

const MONGO_URI = process.env.MONGO_URI!;
console.log("Conectando em:", MONGO_URI);

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conectado ao MongoDB");

        const seed = 123;
        faker.seed(seed); // Para gerar dados consistentes entre execuções
        console.log("Seed:", seed);

        await User.deleteMany({});
        await Car.deleteMany({});

        const users: UserType[] = [];
        const usersIds: string[] = [];

        const cars: CarType[] = [];

        const adminUser = await createFakeUser();
        adminUser.role = "admin";
        adminUser.userType = "navy";
        adminUser.email = "admin@navy.com";
        adminUser.user_profile = undefined;
        adminUser.active = true;
        const createdAdminUser = await User.create(adminUser);

        users.push(createdAdminUser);

        for (let i = 0; i < 3; i++) {
            const userData = await createFakeUser();
            const createdUser = await User.create(userData);

            // O ID do usuário é convertido para string
            const userId = createdUser._id.toString();
            usersIds.push(userId);

            users.push(createdUser);
        }

        for (let i = 0; i < 25; i++) {
            const carData = createFakeCar(usersIds);
            await Car.create(carData);
            cars.push(carData);
        }
        const document = { users, cars };

        const outputPath = path.join(__dirname, outputFileName);

        fs.writeFileSync(
            outputPath,
            JSON.stringify(document, null, 2),
            "utf-8"
        );

        console.log(`Arquivo JSON gerado com sucesso em: ${outputPath}`);
    } catch (err) {
        console.error("Erro ao executar seed:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

function createFakeAddress(): AddressType {
    const address: AddressType = {
        cep: faker.location.zipCode("#####-###"),
        rua: faker.location.street(),
        numero: faker.location.buildingNumber(),
        logradouro: faker.location.streetAddress(),
        estado: faker.location.state({ abbreviated: false }),
        municipio: faker.location.city(),
        location: {
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
        },
    };
    return address;
}

async function createFakeUser(): Promise<UserType> {
    const password = await bcrypt.hash("senha123", 10);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const role = faker.helpers.arrayElement(["client", "employee"]);
    const isClient = role === "client";

    const user: UserType = {
        email: faker.internet.email({
            firstName,
            lastName,
            provider: "test.dev.com",
        }),
        password,
        active: true,
        role,
        user_profile: {
            name: `${firstName} ${lastName}`,
            phone: faker.phone.number({ style: "human" }),
            cpf: faker.string.numeric({ length: 11 }),
            rg: faker.string.numeric({ length: 9 }),
            cnh: isClient ? faker.string.numeric({ length: 9 }) : undefined,
            gender: faker.helpers.arrayElement(["masculino", "feminino"]),
            address: createFakeAddress(),
            // `foto` e `document` são opcionais e omitidos aqui.
        },
    };

    return user;
}

function createFakeCar(usersIds: string[]): CarType {
    const brand = faker.vehicle.manufacturer();
    const model = faker.vehicle.model();
    const year = faker.number.int({ min: 2015, max: 2024 });
    const mileage = faker.number.int({ min: 10_000, max: 120_000 });
    const transmission = faker.helpers.arrayElement([
        "manual",
        "automático",
        "semi-automático",
    ]);
    const color = faker.vehicle.color();

    const operationType = faker.helpers.arrayElement<"sale" | "rent">([
        "sale",
        "rent",
    ]);
    const ownerId = new mongoose.Types.ObjectId(
        faker.helpers.arrayElement(usersIds)
    );

    const rented_at = faker.date.past({ years: 1 });
    const sold_at = faker.date.past({ years: 1 });

    let status: "available" | "rented" | "sold" = "available";
    let rentedBy: mongoose.Types.ObjectId | undefined;
    let soldTo: mongoose.Types.ObjectId | undefined;
    let rentedAt: Date | null = null;
    let soldAt: Date | null = null;

    if (operationType === "sale") {
        status = faker.datatype.boolean() ? "sold" : "available";
        if (status === "sold") {
            soldAt = sold_at;
            soldTo = new mongoose.Types.ObjectId(
                faker.helpers.arrayElement(usersIds)
            );
        }
    } else {
        status = faker.datatype.boolean() ? "rented" : "available";
        if (status === "rented") {
            rentedAt = rented_at;
            rentedBy = new mongoose.Types.ObjectId(
                faker.helpers.arrayElement(usersIds)
            );
        }
    }

    const car: CarType = {
        operationType,
        // Se for venda, o preço é obrigatório
        price:
            operationType === "sale"
                ? faker.number.int({ min: 30_000, max: 150_000 })
                : undefined,
        // Se for aluguel, o preço por hora é obrigatório
        price_per_hour:
            operationType === "rent"
                ? faker.number.int({ min: 50, max: 200 })
                : undefined,
        // Quilometragem do carro
        mileage,
        license_plate: faker.vehicle.vin().slice(0, 7).toUpperCase(),
        photo_url: undefined,
        status,
        rented_at: rentedAt,
        sold_at: soldAt,
        rented_by: rentedBy,
        sold_to: soldTo,
        //
        details: {
            brand,
            model,
            year,
            color,
            fuel_type: faker.helpers.arrayElement([
                "gasolina",
                "álcool",
                "diesel",
                "elétrico",
            ]),
            transmission,
        },
        address: createFakeAddress(),
        owner_id: ownerId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    car.short_description = generateShortDescription(car);

    return car;
}

seed();
