import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";



const router = Router()

router.post('/',auth("admin") ,vehicleControllers.addVehicle)
router.get('/', vehicleControllers.getAllVehicle)
router.get('/:vehicleId', vehicleControllers.getSingleVehicleDetails)
router.put('/:vehicleId',auth("admin"), vehicleControllers.updateVehicle)
router.delete('/:vehicleId',auth("admin"), vehicleControllers.deleteVehicle)




export const vehicleRoutes = router