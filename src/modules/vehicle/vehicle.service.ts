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
const getSingleVehicle = async (vehicleId: number) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId])
    return result
}

const updateVehicle = async (bodyData: any, vehicleId: number) => {

    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = bodyData

    const result = await pool.query(`
        UPDATE vehicles 
        SET
        vehicle_name = COALESCE($1, vehicle_name),
        type = COALESCE($2, type),
        registration_number = COALESCE($3, registration_number),
        daily_rent_price = COALESCE($4, daily_rent_price),
        availability_status = COALESCE($5, availability_status)
        WHERE id = $6 
        RETURNING *`,
        [vehicle_name ?? null, type ?? null, registration_number ?? null, daily_rent_price ?? null, availability_status ?? null, vehicleId])

    return result


}
const deleteVehicle = async (vehicleId: number) => {
    const result = await pool.query(
        `SELECT status FROM bookings WHERE vehicle_id = $1 LIMIT 1`,
        [vehicleId]
    );

    const booking = result?.rows[0];

    if (booking?.status === "active") {
        throw new Error("Cannot delete the vehicle because it has an active booking");
    }
    const res = await pool.query(
        `DELETE FROM vehicles WHERE id = $1`,
        [vehicleId]
    );
    
    return {
        success: true,
        message: "Vehicle deleted successfully",
        res
    };
};


export const vehicleServices = {
    addVehicle,
    getAllVehicle,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
}