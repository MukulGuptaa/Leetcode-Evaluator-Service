import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";

export default class Samplejob implements IJob{
    name: string;
    payload: Record<string, unknown>;

    constructor(payload: Record<string, unknown>){
        this.payload = payload;
        this.name = this.constructor.name;
    }

    handler = () => {
        console.log("Handler of the job called");
    }

    failed = (job?: Job) : void => {
        console.log("Failed of the job called");
        if(job){
            console.log(job.id);
        }
    }

}