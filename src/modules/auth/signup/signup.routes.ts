import { Router } from "express";
import { signUpController } from "./signup.controller";

const router = Router()

router.post('/', signUpController.signUpUser)




export const signUpRoutes = router