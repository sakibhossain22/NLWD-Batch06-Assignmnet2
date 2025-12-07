import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";
import { Vehicleavailability, VehicleType } from "./vehicle.type";

const addVehicle = async (req: Request, res: Response) => {

    try {
        const allowedVehicleType: VehicleType[] = ["van", "car", "bike", "SUV"]
        const allowedVehicleavailability: Vehicleavailability[] = ["available", "booked"]

        if (!allowedVehicleavailability.includes(req?.body?.availability_status)) {
            res.status(400).json({
                "success": false,
                "message": "Invalid Vehicle availability status. Allowed status are available and booked"
            })
        }
        if (!allowedVehicleType.includes(req?.body?.type)) {
            res.status(400).json({
                "success": false,
                "message": "Invalid Vehicle Type. Allowed Type are van, car bike, SUV"
            })
        }
        const result = await vehicleServices.addVehicle(req.body)
        res.status(201).json({
            "success": true,
            "message": "Vehicle created successfully",
            "data": result.rows[0]
        })
    } catch (err: any) {
        res.status(404).json({
            "success": false,
            "message": "Something Went Wrong",
            "error": err
        })
    }
}
const getAllVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getAllVehicle()
        if (result?.rowCount === 0) {
            res.status(200).json({
                "success": true,
                "message": "No vehicles found",
                "data": []
            })
        } else {
            res.status(200).json({
                "success": true,
                "message": "Vehicle retrieved successfully",
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
const getSingleVehicleDetails = async (req: Request, res: Response) => {
    console.log(typeof (req.params.vehicleId));
    const vehicleId = Number(req.params.vehicleId)
    try {
        const result = await vehicleServices.getSingleVehicle(vehicleId as number)

        res.status(200).json({
            "success": true,
            "message": "Vehicle retrieved successfully",
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
const updateVehicle = async (req: Request, res: Response) => {
    const vehicleId = Number(req.params.vehicleId)
    try {
        const result = await vehicleServices.updateVehicle(req.body, vehicleId as number)
        res.status(200).json({
            "success": true,
            "message": "Vehicle updated successfully",
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
const deleteVehicle = async (req: Request, res: Response) => {
    const vehicleId = Number(req.params.vehicleId)
    try {
        const result = await vehicleServices.deleteVehicle(vehicleId as number)

        if (result.rowCount === 0) {
            res.status(404).json({
                "success": false,
                "message": "Vehicle not found"
            })
        } else {
            res.status(200).json({
                "success": true,
                "message": "Vehicle deleted successfully"
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
export const vehicleControllers = {
    addVehicle,
    getAllVehicle,
    getSingleVehicleDetails,
    updateVehicle,
    deleteVehicle
}