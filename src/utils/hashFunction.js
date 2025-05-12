import bcrypt from "bcrypt";

export async function hashPassword(password) {
    const salts = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salts);
    return hashedPassword;
}