import express, {Express} from "express";
import serverConfig from "./config/server.config";
const app: Express = express();

app.listen(serverConfig.PORT, () => {
    console.log(`server is running on port ${serverConfig.PORT}`);
    console.log("Helloworld");
     
})