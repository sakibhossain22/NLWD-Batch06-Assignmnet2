import { Request, Response } from "express";
import { pool } from "../../config/db";
import { vehicleServices } from "../vehicle/vehicle.service";
import { JwtPayload } from "jsonwebtoken";


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
const updateBooking = async (bodyData: Record<string, any>, bookingId: number, user: JwtPayload) => {
    const { status: bookingStatus } = bodyData;
    console.log(bookingId);

    if (!bookingStatus) {
        throw new Error("Status is required");
    }
    // fetch vehicle to update status
    const result = await pool.query(
        `
        UPDATE bookings
        SET status = $1
        WHERE id = $2
        RETURNING *;
        `, [bookingStatus, bookingId]
    );
    const vehicleId = result?.rows[0]?.vehicle_id
    // const vehicle = await vehicleServices.getSingleVehicle(vehicleId)
    // const vehicleRes = vehicle?.rows[0]

    const updateVehicleStatus = await pool.query(`
        UPDATE vehicles
        SET availability_status = $1
        WHERE id = $2
        RETURNING *
        `, ["available", vehicleId])

    const resultVehicleUpdate = updateVehicleStatus?.rows[0]
    console.log(resultVehicleUpdate)
    return { result, resultVehicleUpdate };
};

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
        SET availability_status = $1 WHERE id = $2 RETURNING *
        `, ['booked', vehicle_id])
    return { result, updateVehiStatus }
}
export const bookingServices = {
    getAllBooking,
    updateBooking,
    addBooking
}