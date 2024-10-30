import Docker from "dockerode"
import { TestCases } from "../types/testCases";
import createContainer from "./containerFactory"
import { JAVA_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

async function runJava(code: string, inputTestCase: string) {

    const rawLogBuffer: Buffer[] = [];

    // TO PULL THE IMAGE
    console.log("Please wait till we download the required docker image, this might take few moments");
    await pullImage(JAVA_IMAGE);

    console.log("intialising the new Java container");

    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`

    //console.log(runCommand);
    //const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ["python3", "-c", code, 'stty -echo']);

    const javaDockerContainer = await createContainer(JAVA_IMAGE, [
        '/bin/sh',
        '-c',
        runCommand]);
    
    // starting or booting the java docker container

    await javaDockerContainer.start();

    console.log("Started the docker container");

    const loggerStream = await javaDockerContainer.logs({
        stdout: true,
        stderr: true,
        timestamps: true,
        follow: true //whether the logs are streamed or returned as string
    });

    // Attach events on the stream objects to start and stop reading

    loggerStream.on("data", (chunk) => {
        rawLogBuffer.push(chunk);
    })

    // once the logs are received and decoded we will return a promise to come out to further delete container
    await new Promise((res) => {
        loggerStream.on("end", () => {
            //console.log(rawLogBuffer);

            // Buffer has a constructor when we pass array fo buffer it create a complete buffer
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            //console.log(decodedStream.stdout);
            res(decodeDockerStream);
  
        });
    }); 
    
    // delete the docker container
    await javaDockerContainer.remove();
    
}

export default runJava;

