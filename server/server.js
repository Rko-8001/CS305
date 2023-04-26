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
    app.post("/updateProfile",Helper.updateProfile);
    app.post("/getPostRequest",Helper.getPostRequest);
    app.post("/verifyPostRequest",Helper.verifyPostRequest);
    app.post("/verifyPostRequest",Helper.verifyPostRequest);
    app.post("/postBlog",Helper.postBlog);
    app.post("/postProblems",Helper.postProblems);
    app.post("/postEditorials",Helper.postEditorials);
    app.post("/commentBlog",Helper.commentBlog);
    app.post("/submitSolution",Helper.submitSolution);
    // app.post("/getEditorials",Helper.getEditorials);
    app.post("/getBlogs",Helper.getBlogs);
    app.post("/fetchBlogComments",Helper.fetchBlogComments);
    app.post("/fetchProblemSets",Helper.fetchProblemSets);
    app.post("/getProblemDetails",Helper.getProblemDetails);
    app.post("/viewEditorials",Helper.viewEditorials);
    app.post("/getVerdicts",Helper.viewEditorials);
    // fetchUserInfo
}
main();
