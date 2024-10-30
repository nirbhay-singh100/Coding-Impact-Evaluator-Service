import express, { Express } from "express";
import bodyParser from "body-parser";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import SampleWorker from "./workers/sampleWorker";

// Bull board imports
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import SampleQueue from "./queues/sampleQueue";

import runJava from "./containers/runJavaContainer";
import runCpp from "./containers/runCppConatiner";
import SubmissionWorker from "./workers/submissionWorker";
import { SUBMISSION_QUEUE } from "./utils/constants";
import submissionQueueProducer from "./producers/submissionQueueProducer";
import submissionQueue from "./queues/submissionQueue";

const app: Express = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/api", apiRouter);

app.listen(serverConfig.PORT, () => {
    console.log(`server is running on port ${serverConfig.PORT}`);



    //SampleWorker("SampleQueue");

    const code = `
    #include<iostream>
    using namespace std;

    int main(){

        int x;
        cin>>x;

        for(int i=0;i<=x;i++){
            cout<<i<<endl;
        }
        return 0;
    }
    `;

    const inputTestCase = `30`;

    SubmissionWorker(SUBMISSION_QUEUE);

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/ui");

    createBullBoard({
        queues: [new BullMQAdapter(submissionQueue)],
        serverAdapter,
    })

    app.use("/ui", serverAdapter.getRouter());

    submissionQueueProducer({
        "1234": {
            language: 'CPP',
            code: code,
            inputTestCase: inputTestCase
            
    }})

    

    

    // sampleQueueProducer("SampleJob", {
    //     name: "shraddha",
    //     college: "Yenopoya",
    //     branch: "ISE"
    // })
    // sampleQueueProducer("SampleJob", {
    //     name: "ankita",
    //     college: "chandigarh university",
    //     branch: "cse"
    // })

})