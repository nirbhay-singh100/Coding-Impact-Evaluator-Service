import express from "express";
import { addSubmission }  from "../../controllers/submissionController";
import { validate } from "../../validators/createSubmissionValidator";
import { CreateSubmissionDtoZodSchema } from "../../dtos/CreateSubmissionDto";
const submissionRouter = express.Router();

submissionRouter.post("/", validate(CreateSubmissionDtoZodSchema) as any, addSubmission as any);

export default submissionRouter;
