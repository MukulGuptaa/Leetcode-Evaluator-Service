import express from "express";

import { addSubmission } from "../../controllers/submissionController";
import { createSubmissionZodSchema } from "../../dtos/CreateSubmissionDto";
import { validate } from "../../validators/zodvalidator";

const submissionRouter = express.Router();

submissionRouter.post('/', validate(createSubmissionZodSchema) , addSubmission);

export default submissionRouter;