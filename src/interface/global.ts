interface ICreateUser {
    email: string;
    password: string;
    role: "admin" | "employee" | "client";
    name: string;
    phone: string;
    rg: string;
    cpf: string;
    userType?: "individual" | "company" | "navy";
}


interface ICreateEmployee extends ICreateUser {

}

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

interface ICarSimplified {
    id: string;
    price: number | null | undefined;
    price_per_hour: number | null | undefined;
    mileage: number | null | undefined;
    license_plate: string | null | undefined;
    photo_url: Buffer<ArrayBufferLike> | null | undefined;
    is_available: boolean;
    is_sold: boolean;
    rented_at: NativeDate | null | undefined;
    sold_at: NativeDate | null | undefined;
    short_description: string;
}

export { ICreateUser, ILogin, IUser, ICarSimplified };
