import User from "../models/user.model.js";
import { hashPassword } from "../utils/hashFunction.js";

async function login(data) {
    const user = User.find({email: data.email}).lean();
}

async function create(data) {
    data.password = await hashPassword(data.password);
    console.log(data);
    
    // const user = new User(data);
    // return user.save();
}

async function list() {
    return User.find();
}

export default {
    login,
    create,
    list
}
