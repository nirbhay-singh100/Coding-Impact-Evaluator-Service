import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";
import { SubmissionPayload } from "../types/submissionPayload";
import runCpp from "../containers/runCppConatiner";

export default class SubmissionJob implements IJob{
    name: string;
    payload: Record<string, SubmissionPayload>;
    constructor(payload: Record<string, SubmissionPayload>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }

    handle = async (job: Job) => {
        console.log("Handler of the job called");
        //console.log(this.payload);
        if (job) {
            const key: string = Object.keys(this.payload)[0];
            console.log(key);
            
            const language = this.payload[key].language;

            if (language == "CPP") {
                const response = await runCpp(this.payload[key].code, this.payload[key].inputTestCase);
                console.log(response);
                
            }
        }
    };

    failed = (job?: Job): void => {
        //console.log("Job failed ");
        if (job) {
            console.log(job.id);
        }
    };
}