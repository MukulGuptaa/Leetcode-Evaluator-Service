import sampleQueue from "../queues/sampleQueue";

export default async function(name: string, payload: Record<string, unknown>, priority: number){
    console.log("Producer of the job called");
    await sampleQueue.add(name, payload, {priority} );
}