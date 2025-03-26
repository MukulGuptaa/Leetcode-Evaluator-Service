// import Docker from "dockerode";

// import { TestCases } from "../types/testCases";
// import { raw } from "express";
import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

async function runPython(code: string, inputTestCase: string){

    console.log(`Code: ${code}`);
    const rawLogBuffer: Buffer[] = [];

    // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ["python3", "-c", code, 'stty -echo']);
    // stty -echo command doesn't display the input given by the user in the terminal

    const cmd : string = `echo '${code.replace(/'/g, "\\'")}' > test.py && echo '${inputTestCase.replace(/'/g, "\\'")}' | python3 test.py`;
    console.log("Command is: ", cmd);
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['/bin/sh','-c',cmd]);

    await pythonDockerContainer.start();

    const loggerStream = await pythonDockerContainer.logs({
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

    await pythonDockerContainer.remove();
}

export default runPython;