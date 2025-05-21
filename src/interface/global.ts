interface ICreateUser {
    email: string;
    password: string;
    role: "admin" | "seller" | "buyer";
    document: Buffer;
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

interface IFleet {
    group: string;
    model: string;
    brand: string;
    year: number;
    color: string;
    price: number;
    pricePerHour: number;
    fuelType: string;
    licensePlate: string;
    photoUrl?: string;
    isAvailable?: boolean;
    isSold?: boolean;
    rentedAt?: Date | null;
    soldAt?: Date | null;
}

export { ICreateUser, ILogin, IUser, IFleet };
