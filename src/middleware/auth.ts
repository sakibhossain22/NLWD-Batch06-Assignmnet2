import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from "../config/config";

const auth = (...role: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization
            if (!token) {
                return res.status(500).json({
                    "success": false,
                    "message": "You're not Allowed",
                })

            }
            const split = token?.split(" ");
            const onlyToken = split[1]

            const decode = jwt.verify(onlyToken as string, config.secret as string,) as JwtPayload
            req.user = decode as JwtPayload
            if (role.length && !role.includes(decode.role)) {
                return res.status(500).json({
                    "error": "unauthorized"
                })
            }
            next()
        } catch (err: any) {
            res.status(500).json({
                "success": false,
                "message": err?.message
            })
        }
    }
}

export default auth