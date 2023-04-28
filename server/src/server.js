import express, { json } from "express";

import cors from "cors";


import {adminDB} from "./Utility/admin.js";
import Helper from "./Response/helper.js";
import User from "./Response/user.js"


const app = express();

app.use(cors());
console.log(new Date())
app.use(json());
async function main() {
    await adminDB.connect();
  app.listen(process.env.NODE_PORT, () => {
    console.log(`Server is running on port: ${process.env.NODE_PORT}`);
  });
    app.post("/sendOTP",User.sendOTP);
    app.post("/verifyOTP",User.verifyOTP);
    app.post("/fillDetails",User.fillDetails);
    app.post("/userLogin",User.userLogin);
    app.get("/getUserDetails",User.getUserDetails);
    app.post("/updateProfile",User.updateProfile);
    app.post("/userLogout",User.userLogout);
    app.post("/changePassword",User.changePassword);
    app.get("/getAllHandles",User.getAllHandles);
    app.post("/getPostRequest",Helper.getPostRequest);
    app.post("/verifyPostRequest",Helper.verifyPostRequest);
    app.post("/verifyPostRequest",Helper.verifyPostRequest);
    app.post("/postBlog",Helper.postBlog);
    app.post("/postProblem",Helper.postProblem);
    app.post("/postEditorial",Helper.postEditorial);
    app.post("/commentBlog",Helper.comment);
    app.post("/submitSolution",Helper.submitSolution);
    app.get("/getEditorial",Helper.getEditorial);
    app.get("/getBlogs",Helper.getBlogs);
    app.post("/fetchBlogComments",Helper.fetchBlogComments);
    app.post("/fetchProblemSets",Helper.fetchProblemSets);
    app.post("/getProblemDetails",Helper.getProblemDetails);
    app.post("/viewEditorials",Helper.viewEditorials);
    app.post("/getVerdicts",Helper.viewEditorials);
    // fetchUserInfo
}
main();