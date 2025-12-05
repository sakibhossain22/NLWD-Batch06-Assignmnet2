import { Router } from "express";
import { signInController } from "./signin.controller";


const router = Router()

router.post('/', signInController.signInUser)




export const signInRoutes = router