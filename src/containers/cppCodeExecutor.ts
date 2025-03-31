
import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";


class CppCodeExecutor implements CodeExecutorStrategy{
    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
        console.log('Initialising a new cpp docker container');

        await pullImage(CPP_IMAGE);

        const rawLogBuffer: Buffer[] = [];

        const cmd : string = `echo '${code.replace(/'/g, "\\'")}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, "\\'")}' | ./main`;
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

        try {
            const codeResponse : string = await this.fetchDecodedStream(loggerStream, rawLogBuffer);
            return {output: codeResponse, status: "COMPLETED"};
        } catch (error) {
            return {output: error as string, status: "ERROR"}
        } finally{
            await cppDockerContainer.remove();
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

export default CppCodeExecutor;