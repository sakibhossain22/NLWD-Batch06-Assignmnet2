import { Request, Response } from "express";
import { bookingServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";
import { Status } from "./booking.type";
import { vehicleServices } from "../vehicle/vehicle.service";
import { pool } from "../../config/db";

const getAllBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.getAllBooking(req.user)
        if (result?.rowCount === 0) {
            res.status(200).json({
                "success": true,
                "message": "No Booking found",
                "data": []
            })
        } else {
            res.status(200).json({
                "success": true,
                "message": `${req?.user?.role === "customer" ? "Your Booking retrieved successfully" : "Booking retrieved successfully"}`,
                "data": result?.rows
            })
        }

    } catch (err: any) {
        res.status(404).json(
            {
                "success": false,
                "message": "Something Went Wrong",
                "errors": err?.detail
            }
        )
    }
}
const updateBooking = async (req: Request, res: Response) => {

    try {
        const bookingId = Number(req.params.bookingId)
        // date validation
        const { status: bookingStatus } = req.body
        if (!bookingStatus) {
            throw new Error("Status is required");
        }
        if (bookingStatus === "cancelled") {
            const getBooking = await pool.query(
                `SELECT * FROM bookings WHERE id = $1`,
                [bookingId]
            );

            if (getBooking.rowCount === 0) {
                throw new Error("Booking not found");
            }
            const { rent_start_date } = getBooking.rows[0];
            const startDate = new Date(rent_start_date);
            const today = new Date();
            startDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (today >= startDate) {
                res.status(400).json({
                    "success": false,
                    "message": "You cannot cancel this booking the rent start date has already passed."
                })
            }

        }
        // Date Validation end

        const allowedStatusType: Status[] = ["active", "cancelled", "returned"]
        if (req?.user?.role === "customer" && req?.body?.status === "returned") {
            res.status(403).json({
                "success": false,
                "message": "Customer are not authorized to set status returned"
            })
        }
        if (!allowedStatusType.includes(req?.body?.status)) {
            res.status(400).json({
                "success": false,
                "message": "Invalid availability status. Allowed status are active, cancelled and returned"
            })
        }
        const result = await bookingServices.updateBooking(req.body as any, bookingId as number, req.user as JwtPayload)
        res.status(200).json({
            "success": true,
            "message": `${req?.user?.role === "admin" ? "Booking marked as returned. Vehicle is now available" : req?.user?.role === "customer" && "Booking cancelled successfully"}`,
            "data": req.user?.role === "customer" ? {
                ...result?.result?.rows[0]
            } : {
                ...result?.result?.rows[0],
                "vehicle": {
                    "availability_status": result?.resultVehicleUpdate?.availability_status
                }
            }
        })


    } catch (err: any) {
        console.error(err);

        res.status(404).json(
            {
                "success": false,
                "message": "Something Went Wrong",
                "errors": err
            }
        )
    }
}
const addBooking = async (req: Request, res: Response) => {
    try {
        const { rent_start_date, rent_end_date } = req?.body
        const startDate = new Date(rent_start_date);
        const endDate = new Date(rent_end_date);

        if (endDate < startDate) {
            return res.status(400).json({
                success: false,
                message: "Rent end date cannot be earlier than rent start date"
            });
        }
        const { vehicle_id } = req?.body
        const getVehicle = await vehicleServices.getSingleVehicle(vehicle_id)
        const vehicle = getVehicle?.rows[0]

        if (vehicle.availability_status === "booked") {
            return res.status(404).json({
                "success": false,
                "message": "Selected Vehicle are already booked",
            })
        }

        const result = await bookingServices.addBooking(req.body)


        // status
        res.status(201).json({
            "success": true,
            "message": "Booking created successfully",
            "data": {
                ...result.result.rows[0],
                "vehicle": {
                    "vehicle_name": result?.updateVehiStatus?.rows[0].vehicle_name,
                    "daily_rent_price": result?.updateVehiStatus?.rows[0].daily_rent_price
                }
            }
        })
    } catch (err: any) {
        res.status(404).json({
            "success": false,
            "message": "Something Went Wrong",
            "error": err?.detail
        })
    }
}
export const bookingController = {
    getAllBooking,
    updateBooking,
    addBooking
}