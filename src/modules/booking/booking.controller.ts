import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

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
    const bookingId = Number(req.params.userId)
    try {
        const result = await bookingServices.updateBooking(req.body, bookingId)
        res.status(200).json({
            "success": true,
            "message": "Booking updated successfully",
            "data": result?.rows[0]
        })


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
const addBooking = async (req: Request, res: Response) => {

    try {
        const result = await bookingServices.addBooking(req.body)

        res.status(201).json({
            "success": true,
            "message": "Booking created successfully",
            "data": {
                ...result.result.rows[0],
                "vehicle": {
                    "vehicle_name": result.vehicle.vehicle_name,
                    "daily_rent_price": result.vehicle.daily_rent_price
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