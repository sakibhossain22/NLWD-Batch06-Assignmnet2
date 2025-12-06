import { Request, Response } from "express";
import { pool } from "../../config/db";
import { vehicleServices } from "../vehicle/vehicle.service";


const getAllBooking = async (user: any) => {
    console.log(user);
    if (user?.role === "admin") {
        const result = await pool.query(`SELECT * FROM bookings`)
        return result
    } else if (user?.role === "customer") {
        const result = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1`, [user.id])
        return result
    }
}
const updateBooking = async (bodyData: Record<string, any>, userId: number) => {
    const { name, email, phone, role } = bodyData

    const result = await pool.query(`
        UPDATE users 
        SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        role = COALESCE($4, role)
        WHERE id = $5 
        RETURNING id, name, email, phone, role`,
        [name ?? null, email ?? null, phone ?? null, role ?? null, userId])

    return result
}
const addBooking = async (bodyData: Record<string, any>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = bodyData

    // calculate day
    const startDate = new Date("2025-12-06")
    const endDate = new Date("2025-12-10")
    const time = endDate.getTime() - startDate.getTime()
    const Days = Math.ceil(time / (1000 * 60 * 60 * 24))
    // get vehicle by id
    const res = await vehicleServices.getSingleVehicle(vehicle_id)
    const vehicle = res.rows[0]

    // console.log(returnableData);

    const result = await pool.query(`
        INSERT INTO 
        bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) 
        VALUES($1,$2,$3,$4,$5,$6) 
        RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, Days * vehicle.daily_rent_price, "active"])
    // update vehicle booking status
    const updateVehiStatus = await pool.query(`
        UPDATE vehicles 
        SET availability_status = $1 WHERE id = $2
        `, ['booked', vehicle_id])
    return { result, vehicle }
}
export const bookingServices = {
    getAllBooking,
    updateBooking,
    addBooking
}