import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefinition";
import CodeExecutorStrategy from "../types/CodeExecutorStrategy";
import { SubmissionPayload } from "../types/submissionPayload";
import CreateCodeExectorObject from "../utils/CodeExecutorFactory";


export default class Samplejob implements IJob{
    name: string;
    payload: Record<string, SubmissionPayload>;

    constructor(payload: Record<string, SubmissionPayload>){
        this.payload = payload;
        this.name = this.constructor.name;
    }

    handler = async (job?: Job) => {
        console.log("Handler of the job called");
        if(job){
            console.log(this.payload);
            const key = Object.keys(this.payload)[0];
            if(!key) return;
            const codeLanguage = this.payload[key].language;
            const inputCase = this.payload[key].inputCase;
            const code = this.payload[key].code;

            const strategy : CodeExecutorStrategy | null = CreateCodeExectorObject(codeLanguage);
            if(strategy != null){
                const response = await strategy.execute(code, inputCase);
                if(response.status === "COMPLETED"){
                    console.log("Code executed successfully");
                    console.log(response);
                }else{
                    console.log("Something went wrong with the code execution..");
                    console.log(response);
                }
            }

        }
    };

    failed = (job?: Job) : void => {
        console.log("Failed of the job called");
        if(job){
            console.log(job.id);
        }
    };

}