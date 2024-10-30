import Docker from "dockerode"
import { TestCases } from "../types/testCases";
import createContainer from "./containerFactory"
import { CPP_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

async function runCpp(code: string, inputTestCase: string) {

    const rawLogBuffer: Buffer[] = [];

    // TO PULL THE IMAGE
    console.log("Please wait till we download the required docker image, this might take few moments");
    await pullImage(CPP_IMAGE);

    console.log("intialising the new Cpp container");

    // both will work
    //const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.cpp && g++ test.cpp -o abc.exe && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./abc.exe`
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.cpp && g++ test.cpp -o abc && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./abc`

    //console.log(runCommand);
    //const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ["python3", "-c", code, 'stty -echo']);

    const cppDockerContainer = await createContainer(CPP_IMAGE, [
        '/bin/sh',
        '-c',
        runCommand]);
    
    // starting or booting the cpp docker container

    await cppDockerContainer.start();

    console.log("Started the docker container");

    const loggerStream = await cppDockerContainer.logs({
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
    await cppDockerContainer.remove();
    
}

export default runCpp;