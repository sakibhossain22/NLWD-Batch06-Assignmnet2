import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUser()
        if (result?.rowCount === 0) {
            res.status(200).json({
                "success": true,
                "message": "No user found",
                "data": []
            })
        } else {
            res.status(200).json({
                "success": true,
                "message": "Users retrieved successfully",
                "data": result?.rows
            })
        }

    } catch (err: any) {
        res.status(404).json(
            {
                "success": false,
                "message": "Something Went Wrong",
                "errors": err?.detail
            }
        )
    }
}
const updateUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId)
    try {
        const result = await userServices.updateUser(req.body as any , userId  as number)
        res.status(200).json({
            "success": true,
            "message": "User updated successfully",
            "data": result?.rows[0]
        })


    } catch (err: any) {
        res.status(404).json(
            {
                "success": false,
                "message": "Something Went Wrong",
                "errors": err?.detail
            }
        )
    }
}
const deleteUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId)
    try {
        const result = await userServices.deleteUser(userId as number)

        if (result.rowCount === 0) {
            res.status(404).json({
                "success": false,
                "message": "User not found"
            })
        } else {
            res.status(200).json({
                "success": true,
                "message": "User deleted successfully"
            })
        }


    } catch (err: any) {
        res.status(404).json(
            {
                "success": false,
                "message": "Something Went Wrong",
                "errors": err?.detail
            }
        )
    }
}
export const userController = {
    getAllUser,
    updateUser,
    deleteUser,

}