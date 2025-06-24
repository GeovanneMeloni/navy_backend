import { ObjectId } from "mongoose";

interface ICreateUser {
    email: string;
    password: string;
    role: "admin" | "employee" | "client";
    name: string;
    phone: string;
    rg: string;
    cpf: string;
    userType?: "individual" | "company" | "navy";
    gender?: "masculino" | "feminino";
    cnh?: string;

    cep?: string;
    rua?: string;
    numero?: string;
    logradouro?: string;
    estado?: string;
    municipio?: string;
    complemento?: string;
    tipoEndereco?: string;

    latitude?: number;
    longitude?: number;
}

interface ICreateEmployee extends ICreateUser {}

interface IUpdateUser extends ICreateUser {}

interface ILogin {
    email: string;
    password: string;
}

interface IUser {
    email: string;
    password: string;
    active: string;
    role: string;
}

interface ICreateCar {
    operationType?: "rent" | "sale";
    price?: number;
    price_per_hour?: number;
    license_plate: string;

    status: "available" | "rented" | "sold";
    rented_at?: NativeDate;
    sold_at?: NativeDate;
    rented_by?: string;
    sold_to?: string;

    mileage?: number;

    // Identificador do dono do carro
    owner_id: string;

    group?: string;
    model: string;
    brand: string;
    year: number;
    color: string;
    fuel_type?: string;
    transmission?: string;

    // Endereço - campos planos
    cep?: string;
    rua?: string;
    numero?: string;
    logradouro?: string;
    estado?: string;
    municipio?: string;

    // Localização - também campos planos
    latitude?: number;
    longitude?: number;
}

interface ILoginResponse {
    tokenJWT: string;
    user: {
        id: any;
        name: string;
    };
}

export { ICreateUser, ILogin, IUser, ICreateCar, ILoginResponse, IUpdateUser };
