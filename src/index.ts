import bodyParser from "body-parser";
import express from "express";

import bullBoardAdapter from "./config/bullBoardConfig";
import serverConfig from "./config/serverConfig";
import runCpp from "./containers/runCpp";
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
    #include<stdio.h>
    #include<iostream>
    using namespace std;
    int main(){
    int n;
    cin>>n;
    cout<<"Value provided is: "<<n<<endl;
    for(int i=0;i<n;i++){
        cout<<i<<" ";
    }
    return 0;
    }
    `;

    const inputCase = `8`;


    runCpp(code, inputCase);


});