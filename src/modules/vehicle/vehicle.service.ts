import { pool } from "../../config/db"

const addVehicle = async (bodyData: Record<string, any>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = bodyData

    const result = await pool.query(`INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status])

    return result
}
const getAllVehicle = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`)
    return result
}

export const vehicleServices = {
    addVehicle,
    getAllVehicle,
}