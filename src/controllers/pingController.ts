import { Request, Response } from "express";

export const pingCheck = (req: Request, res: Response) => {
    
    return res.status(201).json({
        message: "the service is working",
    });
    
}; 