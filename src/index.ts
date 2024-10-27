import express, { Express } from "express";
import bodyParser from "body-parser";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import SampleWorker from "./workers/sampleWorker";

const app: Express = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/api", apiRouter);

app.listen(serverConfig.PORT, () => {
    console.log(`server is running on port ${serverConfig.PORT}`);

    SampleWorker("SampleQueue");

    sampleQueueProducer("SampleJob", {
        name: "nirbhay",
        college: "chandigarh university",
        branch: "cse"
    })
    sampleQueueProducer("SampleJob", {
        name: "harshit",
        college: "chandigarh university",
        branch: "cse"
    })
    
     
})