import express, { json } from "express";
import cors from "cors";
import Problem from "./Response/problems.js";
import User from "./Response/user.js";
import Blog from "./Response/blog.js";
import Admin  from "./Utility/admin.js";

async function main() {
  let admin = new Admin(`${process.cwd()}/.env`);
  const app = express();
  app.use(cors());
  console.log(new Date());
  app.use(json());
  await admin.adminDB.connect();
  let user = new User(admin.adminDB,admin.adminJWT,admin.adminMail);
  let blog = new Blog(admin.adminDB,admin.adminJWT);
  let problem = new Problem(admin.adminDB,admin.adminJWT);
  app.listen(process.env.NODE_PORT, () => {
    console.log(`Server is running on port: ${process.env.NODE_PORT}`);
  });
  app.post("/sendOTP", user.sendOTP);
  app.post("/verifyOTP", user.verifyOTP);
  app.post("/fillDetails", user.fillDetails);
  app.post("/userLogin", user.userLogin);
  app.post("/getUserDetails", user.getUserDetails);
  app.post("/updateProfile", user.updateProfile);
  app.post("/userLogout", user.userLogout);
  app.post("/changePassword", user.changePassword);
  app.get("/getAllHandles", user.getAllHandles);
  app.post("/postBlog", blog.postBlog);
  app.post("/postProblem", problem.postProblem);
  app.post("/postEditorial", blog.postEditorial);
  app.post("/comment", blog.comment);
  app.post("/submitSolution", problem.submitSolution);
  app.get("/getEditorial", blog.getEditorial);
  app.get("/getBlogs", blog.getBlogs);
  app.post("/getBlogComments", blog.getBlog);
  app.post("/fetchSolvedProblems", problem.fetchSolvedProblems);
  app.post("/fetchAllSubmissions", problem.fetchAllSubmissions);
  app.get("/fetchAllProblems", problem.fetchAllProblems);
  app.post("/fetchProblemDetails", problem.fetchProblemDetails);
  // app.post("/getProblemDetails",Problem.getProblemDetails);
  // app.post("/viewEditorials",Problem.viewEditorials);
  // app.post("/getVerdicts",Problem.viewEditorials);
  // fetchUserInfo
}
main();
