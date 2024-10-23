import { Request, Response } from "express";

export const pingCheck = (req: Request, res: Response) => {
    
    res.status(200).json({
        message: "server is running"
    })
    
}; 