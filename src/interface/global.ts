interface ICreateUser {
    email: string;
    password: string;
    type: "admin" | "employer";
}

interface ILogin {
    email: string;
    password: string;
}

export { ICreateUser, ILogin };
