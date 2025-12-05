import { pool } from "../../../config/db"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import config from "../../../config/config";
const signInUser = async (email: string, password: string) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if (result.rows.length === 0) {
            return {
                "errors": "Error ! users not found"
            }
        }
        const user = result.rows[0]
        const { id, name, phone, role } = result.rows[0]

        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) {
            return {
                "errors": 'You entered wrong password'
            }
        }
        const token = jwt.sign(user, config.secret as string, { expiresIn: '7d' })
        console.log(token);
        return {
            user: {
                id, name, email, phone, role
            }, token
        }

    } catch (err: any) {
        return {
            "success": false,
            "message": err.message
        }
    }
}

export const signInService = {
    signInUser
}