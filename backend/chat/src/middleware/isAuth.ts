import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken';

interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log(req.headers, "headers")
        const header = req.headers.authorization;
        console.log(header, "header")
        console.log(header?.startsWith("Bearer "))
        if (!header || !header.startsWith("Bearer ")) {
            res.status(403).json({
                message: "Please login- No Auth header."
            })
            return;
        }

        const token: any = header.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if (!decoded || !decoded.user) {
            res.status(401).json({
                message: "Invalid token"
            });
            return;
        }

        req.user = decoded.user as IUser;
        next()
    } catch (err) {
        res.status(401).json({
            message: "Invalid token",
            error:err
        })
        return
    }
}

export default isAuth;