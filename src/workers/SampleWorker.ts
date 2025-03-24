import { Job, Worker } from "bullmq";

import redisConnection from "../config/redisConfig";
import Samplejob from "../jobs/SampleJob";

export default function SampleWorker(queueName: string){
    new Worker(
        queueName, 
        async (job: Job) => {
            if(job.name === "SampleJob"){
                const sampleJobInstance = new Samplejob(job.data);
                sampleJobInstance.handler(job);
                return true;
            }
        },
        {
            connection: redisConnection
        });

}