import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";



const router = Router()

router.post('/', vehicleControllers.addVehicle)
router.get('/', vehicleControllers.getAllVehicle)
router.get('/:vehicleId', vehicleControllers.getSingleVehicleDetails)
router.put('/:vehicleId', vehicleControllers.updateVehicle)




export const vehicleRoutes = router