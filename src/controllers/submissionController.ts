import { Request, Response } from "express";

import { CreateSubmissionDto } from "../dtos/CreateSubmissionDto";

export function addSubmission(req: Request, res: Response){
    const submissionDto = req.body as CreateSubmissionDto;
    console.log(submissionDto);

    // TODO: Add validation using zod.

    res.status(201).json({
        success: true,
        error: {},
        message: "Submission added successfully",
        data: submissionDto,
    });
}