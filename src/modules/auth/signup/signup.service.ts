import { pool } from "../../../config/db"

const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone = null, role } = payload

    const result = await pool.query(`INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role`, [name, email, password, phone, role])
    return result
}

export const signUpService = {
    createUser
}