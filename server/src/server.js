import express, { json } from "express";

import cors from "cors";


import {adminDB} from "./Utility/admin.js";
import Problem from "./Response/problems.js";
import User from "./Response/user.js"
import Blog from "./Response/blog.js"


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
    app.post("/postBlog",Blog.postBlog);
    app.post("/postProblem",Problem.postProblem);
    app.post("/postEditorial",Blog.postEditorial);
    app.post("/comment",Blog.comment);
    app.post("/submitSolution",Problem.submitSolution);
    app.get("/getEditorial",Blog.getEditorial);
    app.get("/getBlogs",Blog.getBlogs);
    app.post("/fetchSolvedProblems",Problem.fetchSolvedProblems);
    app.post("/fetchAllSubmissions",Problem.fetchAllSubmissions);
    // app.post("/fetchBlogComments",Problem.fetchBlogComments);
    // app.post("/fetchProblemSets",Problem.fetchProblemSets);
    // app.post("/getProblemDetails",Problem.getProblemDetails);
    // app.post("/viewEditorials",Problem.viewEditorials);
    // app.post("/getVerdicts",Problem.viewEditorials);
    // fetchUserInfo
}
main();
