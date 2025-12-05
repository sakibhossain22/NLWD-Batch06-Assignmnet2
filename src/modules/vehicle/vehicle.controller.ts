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

export const vehicleControllers = {
    addVehicle,
}