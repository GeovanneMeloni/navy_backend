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

const __filename = fileURLToPath(import.meta.url);
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
        adminUser.login = true;
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
    const role = faker.helpers.arrayElement(["seller", "buyer"]);
    const isClient = role === "buyer";

    const user: UserType = {
        email: faker.internet.email({
            firstName,
            lastName,
            provider: "test.dev.com",
        }),
        password,
        login: false,
        active: true,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
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
    const rented_at = faker.date.past({ years: 1 });
    const sold_at = faker.date.past({ years: 1 });

    const isSold = faker.datatype.boolean();
    const isAvailableToRent = isSold == false && faker.datatype.boolean();

    let userId: mongoose.Types.ObjectId | undefined = undefined;
    // Se o carro estiver disponível para alugar ou já vendido, associar a um usuário
    if (isAvailableToRent || isSold) {
        const randomNumber = faker.number.int({ min: 0, max: 10 });
        // 50% de chance de não ter um usuário associado
        const mockUserId =
            randomNumber > 5 ? undefined : faker.helpers.arrayElement(usersIds);
        // Se o mockUserId for undefined, não associar a um usuário
        if (mockUserId) userId = new mongoose.Types.ObjectId(mockUserId);
    }

    const car: CarType = {
        price: faker.number.int({ min: 30_000, max: 150_000 }),
        price_per_hour: faker.number.int({ min: 50, max: 200 }),
        mileage,
        license_plate: faker.vehicle.vin().slice(0, 7).toUpperCase(),
        // photo_url: faker.image.urlPicsumPhotos({ width: 600, height: 400 }),
        is_available: isAvailableToRent,
        is_sold: isSold,
        seller_id: isSold ? userId : undefined,
        sold_at: isSold ? sold_at : undefined,

        address: createFakeAddress(),

        renter_id: isAvailableToRent ? userId : undefined,
        rented_at: isAvailableToRent ? rented_at : undefined,

        short_description: `${brand.toUpperCase()} ${model.toUpperCase()} ${mileage.toLocaleString()} km ${year} ${transmission.toUpperCase()}`,
        details: {
            brand,
            model,
            year,
            color: faker.vehicle.color(),
            fuel_type: faker.helpers.arrayElement([
                "gasolina",
                "álcool",
                "diesel",
                "elétrico",
            ]),
            transmission,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return car;
}

seed();
