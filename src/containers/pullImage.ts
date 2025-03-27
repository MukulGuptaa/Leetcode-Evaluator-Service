import Docker from "dockerode";

export default async function pullImage(imageName: string){
    try {
        const docker = new Docker();
        return new Promise((resolve, reject) => {
            docker.pull(imageName, (err: Error, stream: NodeJS.ReadableStream) => {
                if(err){
                    throw err;
                }
                docker.modem.followProgress(stream, (err, response) => err ? reject(err) : resolve(response), (event) => {
                    console.log(event.status);
                });
            });
        });
        
    } catch (error) {
        console.log(error);
    }
}