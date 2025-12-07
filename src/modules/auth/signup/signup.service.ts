import { pool } from "../../../config/db";
import bcrypt from "bcryptjs";
import { Role } from "./signup.type";

const createUser = async (payload: Record<string, any>) => {
    try {
        const { name, email, password, phone, role } = payload;

        if (!name || !email || !password || !phone) {
            throw new Error("name, email, phone and password are required");
        }
        
        const hashedPass = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users(name, email, password, phone, role)
             VALUES($1, $2, $3, $4, $5)
             RETURNING id, name, email, phone, role`,
            [name, email.toLowerCase(), hashedPass, phone, role as Role]
        );

        return result;

    } catch (err: any) {
        console.error(err);
    }
};

export const signUpService = {
    createUser
};
