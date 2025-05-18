interface ICreateUser {
    email: string;
    password: string;
    role: "admin" | "seller" | "buyer";
    document: Buffer
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

export { ICreateUser, ILogin, IUser };
