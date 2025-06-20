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

interface ICreateEmployee extends ICreateUser {}

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
