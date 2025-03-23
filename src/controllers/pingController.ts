import { Request, Response } from "express";

function pingCheck(_: Request, res: Response) {
    res.status(200).json({
        message: "Ping check ok!!"
    });
}



export default pingCheck;