import express from "express";

import serverConfig from "./config/serverConfig";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import SampleWorker from "./workers/SampleWorker";

const app = express();

app.use('/api', apiRouter);

app.listen(serverConfig.PORT, () => {
    console.log(`Started server using typescript at ${serverConfig.PORT}`);

    SampleWorker('SampleQueue');

    sampleQueueProducer('SampleJob', {
        name: "Himanshu",
        company: "xyz",
        position: "SE",
        location: "Agra"
    }, 2);
    sampleQueueProducer('SampleJob', {
        name: "Mukul",
        company: "Google",
        position: "SE",
        location: "BLR"
    }, 1);
});