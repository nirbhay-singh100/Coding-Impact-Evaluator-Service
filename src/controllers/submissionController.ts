import { Request, Response } from "express";
import { CreateSubmissionDto } from "../dtos/CreateSubmissionDto";

export const addSubmission = (req: Request, res: Response) => {
    const submissionDto = req.body as CreateSubmissionDto; 
    console.log(submissionDto);
    
    return res.status(201).json({
        success: true,
        error: {},
        message: "Succesfully collected the submission",
        data: submissionDto
    })
}