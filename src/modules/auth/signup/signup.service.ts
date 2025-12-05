import { pool } from "../../../config/db";
import bcrypt from "bcryptjs";

const createUser = async (payload: Record<string, any>) => {
    try {
        const { name, email, password, phone = null, role = "user" } = payload;

        if (!name || !email || !password) {
            throw new Error("Name, email, and password are required");
        }

        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users(name, email, password, phone, role)
             VALUES($1, $2, $3, $4, $5)
             RETURNING id, name, email, phone, role`,
            [name, email, hashedPass, phone, role]
        );

        return result;

    } catch (err:any) {
        console.error(err?.detail);
    }
};

export const signUpService = {
    createUser
};
