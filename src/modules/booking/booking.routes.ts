import { Router } from "express";
import { bookingController } from "./booking.controller";

const router = Router()
router.post('/',bookingController.addBooking)
router.get('/', bookingController.getAllBooking)
router.put('/:bookingId', bookingController.updateBooking)


export const bookingRoutes = router