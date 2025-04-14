import Docker from "dockerode";

async function createContainer(imageName: string, cmdExecutable: string[]){
    const docker = new Docker();

    const container = await docker.createContainer({
        Image: imageName,
        Cmd: cmdExecutable,
        AttachStdin: true, // enable input streams
        AttachStdout: true, // enable output streams
        AttachStderr: true, // enable error streams
        Tty: false,
        HostConfig: {
            Memory: 1024 * 1024 * 512, // 
        },
        OpenStdin: true // keep input stream open even if no interaction is there
    });

    return container;
}

export default createContainer;