import { Request, Response } from "express";
import { signUpService } from "./signup.service";

const signUpUser = async (req: Request, res: Response) => {

    try {
        const result =await signUpService.createUser(req.body)
        console.log(result);
        res.status(200).json({
            "success": true,
            "message": "User registered successfully",
            "data": result.rows[0]
        })
    } catch (err: any) {
        res.status(404).json({
            "success": false,
            "message": "Sign Up User interrupted",
            "errors": err.message
        })
    }


}


export const signUpController = {
    signUpUser
}