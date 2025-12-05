import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const addVehicle = async (req: Request, res: Response) => {

    try {
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
            "error": err?.detail
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
                "data": result?.rows[0]
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

export const vehicleControllers = {
    addVehicle,
    getAllVehicle,
    getSingleVehicleDetails,

}