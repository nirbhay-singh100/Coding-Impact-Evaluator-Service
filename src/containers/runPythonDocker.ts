import Docker from "dockerode"
import { TestCases } from "../types/testCases";
import createContainer from "./containerFactory"
import { PYTHON_IMAGE } from "../utils/constants";
import decodeDockerStream from "./dockerHelper";

async function runPython(code: string, inputTestCase: string) {

    const rawLogBuffer: Buffer[] = [];

    console.log("intialising the new python container");

    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py `

    //console.log(runCommand);
    //const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ["python3", "-c", code, 'stty -echo']);

    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['/bin/sh', '-c', runCommand]);
    
    // starting or booting the python docker container

    await pythonDockerContainer.start();

    console.log("Started the docker container");

    const loggerStream = await pythonDockerContainer.logs({
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
            console.log(decodedStream.stdout);
            res(decodeDockerStream);
  
        });
    }); 
    
    // delete the docker container
    await pythonDockerContainer.remove();
    
}

export default runPython;