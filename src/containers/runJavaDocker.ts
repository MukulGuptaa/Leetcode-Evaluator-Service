// import Docker from "dockerode";

// import { TestCases } from "../types/testCases";
// import { raw } from "express";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

async function runJava(code: string, inputTestCase: string){

    console.log('Initialising a new java docker container');
    const rawLogBuffer: Buffer[] = [];

    const cmd : string = `echo '${code.replace(/'/g, "\\'")}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, "\\'")}' | java Main`;
    console.log("Command is: ", cmd);
    const javaDockerContainer = await createContainer(JAVA_IMAGE, ['/bin/sh','-c',cmd]);

    await javaDockerContainer.start();

    const loggerStream = await javaDockerContainer.logs({
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

    await javaDockerContainer.remove();
}

export default runJava;