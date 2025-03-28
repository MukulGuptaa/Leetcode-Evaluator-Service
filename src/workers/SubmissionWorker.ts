import { Job, Worker } from "bullmq";

import redisConnection from "../config/redisConfig";
import SubmissionJob from "../jobs/SubmissionJob";
import { SUBMISSION_JOB } from "../utils/constants";

export default function SubmissionWorker(queueName: string){
    new Worker(
        queueName, 
        async (job: Job) => {
            if(job.name === SUBMISSION_JOB){
                const submissionJobInstance = new SubmissionJob(job.data);
                submissionJobInstance.handler(job);
                return true;
            }
        },
        {
            connection: redisConnection
        });

}