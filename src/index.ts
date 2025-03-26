import bodyParser from "body-parser";
import express from "express";

import bullBoardAdapter from "./config/bullBoardConfig";
import serverConfig from "./config/serverConfig";
import runPython from "./containers/runPythonDocker";
import apiRouter from "./routes";
import SampleWorker from "./workers/SampleWorker";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use('/api', apiRouter);
app.use('/ui', bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
    console.log(`Started server using typescript at ${serverConfig.PORT}`);
    console.log(`BullBoard dashboard running on: http://localhost:${serverConfig.PORT}/ui`);

    SampleWorker('SampleQueue');

    const code = `
x = input() 
y = input()
print("value of x is", x)
print("value of y is", y)`;
    runPython(code, `100
200`);


});