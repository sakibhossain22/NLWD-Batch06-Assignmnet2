import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router()
router.post('/', auth("admin", "customer"), bookingController.addBooking)
router.get('/', auth("admin", "customer"), bookingController.getAllBooking)
router.put('/:bookingId', auth("admin", "customer"), bookingController.updateBooking)


export const bookingRoutes = router