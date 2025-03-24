import sampleQueue from "../queues/sampleQueue";

export default async function(name: string, payload: Record<string, unknown>){
    console.log("Producer of the job called");
    await sampleQueue.add(name, payload);
}