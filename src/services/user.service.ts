import User from "../models/user.model.ts";
import { hashPassword } from "../utils/hashFunction.ts";

async function login(data: ILogin) {
    const user = User.find({email: data.email}).lean();

    
}

async function create(data: ICreateUser) {
    data.password = await hashPassword(data.password);
    console.log(data);
    
    const user = new User(data);
    return user.save();
}

async function list() {
    return User.find();
}

export default {
    login,
    create,
    list
}
