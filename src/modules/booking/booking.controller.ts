import { Request, Response } from "express";
import { bookingServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";
import { Status } from "./booking.type";

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
        const allowedStatusType: Status[] = ["active", "cancelled", "returned"]
        if(req?.user?.role === "customer" && req?.body?.status === "returned") {
            res.status(403).json({
                "success": false,
                "message": "Customer are not authorized to set status returned"
            })
        }
        if (!allowedStatusType.includes(req?.body?.status)) {
            res.status(400).json({
                "success": false,
                "message": "Invalid Status availability status. Allowed status are active, cancelled and returned"
            })
        }
        const result = await bookingServices.updateBooking(req.body, bookingId, req.user as JwtPayload)
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
    const { rent_start_date, rent_end_date } = req?.body
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    if (endDate < startDate) {
        return res.status(400).json({
            success: false,
            message: "Rent end date cannot be earlier than rent start date"
        });
    }
    try {
        const result = await bookingServices.addBooking(req.body)

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