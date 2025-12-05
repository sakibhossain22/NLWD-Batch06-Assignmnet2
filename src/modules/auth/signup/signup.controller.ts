import { Request, Response } from "express";
import { signUpService } from "./signup.service";

const signUpUser = async (req: Request, res: Response) => {
    try {
        if (req?.body?.password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password Must Be 6 Character Long",
            });
        }
        const result = await signUpService.createUser(req.body);

        if (!result || !result.rows || result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "User Exists",
            });
        }

        const user = result.rows[0];

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });

    } catch (err: any) {
        console.error(err?.detail);
    }
};

export const signUpController = {
    signUpUser
};
