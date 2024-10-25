import express, {Express} from "express";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import SampleWorker from "./workers/sampleWorker";

const app: Express = express();

app.use("/api", apiRouter);

app.listen(serverConfig.PORT, () => {
    console.log(`server is running on port ${serverConfig.PORT}`);
    console.log("Hello world");

    SampleWorker("SampleQueue");
    sampleQueueProducer("SampleJob", {
        name: "nirbhay",
        college: "chandigarh university",
        branch: "cse"
    })
     
})