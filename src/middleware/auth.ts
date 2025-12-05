import { NextFunction, Request, Response } from "express"

const auth = async () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization
        console.log({ 'token : ': token });
        next()
    }
}

export default auth