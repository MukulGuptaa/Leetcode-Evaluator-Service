// import Docker from "dockerode";

// import { TestCases } from "../types/testCases";
// import { raw } from "express";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

async function runCpp(code: string, inputTestCase: string){

    console.log('Initialising a new cpp docker container');

    await pullImage(CPP_IMAGE);

    const rawLogBuffer: Buffer[] = [];

    const cmd : string = `echo '${code.replace(/'/g, "\\'")}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, "\\'")}' | ./main`;
    console.log("Command is: ", cmd);
    const cppDockerContainer = await createContainer(CPP_IMAGE, ['/bin/sh','-c',cmd]);

    await cppDockerContainer.start();

    const loggerStream = await cppDockerContainer.logs({
        stdout: true,
        stderr: true,
        timestamps: false,
        follow: true // logs are streamed in real time
    });

    // Attach events on the stream objects to start and stop reading
    loggerStream.on("data", (chunk) => {
        rawLogBuffer.push(chunk);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await new Promise((resolve, _) => {
        loggerStream.on('end', () => {
            console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            console.log("Output: ", decodedStream.stdout);
            resolve(decodedStream);
        });
    });

    await cppDockerContainer.remove();
}

export default runCpp;