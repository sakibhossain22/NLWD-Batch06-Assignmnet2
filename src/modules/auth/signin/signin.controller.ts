import { Request, Response } from "express";
import { signInService } from "./signin.service";

const signInUser = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const emailLower = email?.toLowerCase()
    try {
        const result = await signInService.signInUser(emailLower, password)
        if (result.token) {
            res.status(200).json({
                "success": true,
                "message": "Login successfully",
                "data": {
                    "token": result.token,
                    "user": result.user
                }
            })
        }

    } catch (err: any) {
        res.status(404).json({
            "success": false,
            "message": "Sign Up User interrupted",
            "errors": err.message
        })
    }


}


export const signInController = {
    signInUser
}