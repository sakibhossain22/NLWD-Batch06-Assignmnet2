import { Router } from "express";
import { userController } from "./user.controller";

const router = Router()

router.get('/', userController.getAllUser)
router.put('/:userId', userController.updateUser)


export const userRoutes = router