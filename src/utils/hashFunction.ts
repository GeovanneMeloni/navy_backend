import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
    const salts = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salts);
    return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword)
}