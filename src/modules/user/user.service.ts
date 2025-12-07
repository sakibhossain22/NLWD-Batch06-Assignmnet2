import { Request, Response } from "express";
import { pool } from "../../config/db";
import { JwtPayload } from "jsonwebtoken";

const getAllUser = async () => {
    const result = await pool.query(`SELECT * FROM users`)
    return result
}
const updateUser = async (user: any, bodyData: any, userId: number) => {
    const { name, email, phone, role } = bodyData;

    // CUSTOMER: can update ONLY own profile, and cannot change role
    if (user.role === "customer") {
        const result = await pool.query(
            `
            UPDATE users 
            SET
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            phone = COALESCE($3, phone)
            WHERE id = $4
            RETURNING id, name, email, phone, role
            `,
            [name ?? null, email ?? null, phone ?? null, userId]
        );

        return result;
    }
    const result = await pool.query(
        `
        UPDATE users 
        SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        role = COALESCE($4, role)
        WHERE id = $5 
        RETURNING id, name, email, phone, role
        `,
        [name ?? null, email ?? null, phone ?? null, role ?? null, userId]
    );

    return result;
};

const deleteUser = async (userId: number, user: JwtPayload) => {
   
    const result = await pool.query(`
        DELETE FROM users
        WHERE id= $1`,
        [userId])
    return result
}
export const userServices = {
    getAllUser,
    updateUser,
    deleteUser,

}