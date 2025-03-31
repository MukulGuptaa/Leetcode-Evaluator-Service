
import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";


class PythonCodeExecutor implements CodeExecutorStrategy{
    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
        console.log(`Code: ${code}`);

        await pullImage(PYTHON_IMAGE);

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

        try {
            const codeResponse : string = await this.fetchDecodedStream(loggerStream, rawLogBuffer);
            return {output: codeResponse, status: "COMPLETED"};
        } catch (error) {
            return {output: error as string, status: "ERROR"}
        } finally{
            await pythonDockerContainer.remove();
        }


    }

    async fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]) : Promise<string> {
        return new Promise((resolve, reject) => {
            loggerStream.on('end', () => {
                console.log(rawLogBuffer);
                const completeBuffer = Buffer.concat(rawLogBuffer);
                const decodedStream = decodeDockerStream(completeBuffer);
                console.log(decodedStream);
                console.log("Output: ", decodedStream.stdout);
                if(decodedStream.stderr){
                    reject(decodedStream.stderr);
                }else{
                    resolve(decodedStream.stdout);
                }
            });
        })
    }
    
}

export default PythonCodeExecutor;