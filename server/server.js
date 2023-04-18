import express, { json } from "express";

import cors from "cors";


import {adminDB} from "./admin.js";
import Helper from "./helper.js";


const app = express();

app.use(cors());

app.use(json());
async function main() {
    await adminDB.connect();
  app.listen(process.env.NODE_PORT, () => {
    console.log(`Server is running on port: ${process.env.NODE_PORT}`);
  });
    app.post("/sendOTP",Helper.sendOTP);
    app.post("/verifyOTP",Helper.verifyOTP);
    app.post("/fillDetails",Helper.fillDetails);
    app.post("/userLogin",Helper.userLogin);
}
main();
