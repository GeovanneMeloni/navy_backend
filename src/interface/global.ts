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

export { ICreateUser, ILogin };
