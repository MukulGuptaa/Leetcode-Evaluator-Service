import express from "express";

import serverConfig from "./config/serverConfig";

const app = express();
app.listen(serverConfig.PORT, () => {
    console.log(`Started server using typescript at ${serverConfig.PORT}`);
});