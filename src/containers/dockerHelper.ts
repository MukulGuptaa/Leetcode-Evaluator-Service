import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

export default function decodeDockerStream(buffer: Buffer): DockerStreamOutput {
    let offset = 0; // keeps track of the current position in the buffer while parsing
    
    // Output object will store the accumulated stdout and stderr output as strings
    const output: DockerStreamOutput = {stdout: '', stderr: ''};

    while(offset < buffer.length){

        // typeOfStream represents the type of stream (stderr/ stdout)
        const typeOfStream = buffer[offset];

        // length variable stores the length of the value.
        // we will read this variable on an offset of 4 bytes from the start of the chunk
        const length = buffer.readUInt32BE(offset + 4);

        // as now we have read the header, we can move forward to the value of the chunk
        offset += DOCKER_STREAM_HEADER_SIZE;

        if(typeOfStream === 1){
            // stdout stream
            output.stdout += buffer.toString('utf-8', offset, offset + length);
        }else if(typeOfStream === 2){
            // stderr stream
            output.stderr += buffer.toString('utf-8', offset, offset + length);
        }

        offset += length; // move offset to next chunk

    }

    return output;

}