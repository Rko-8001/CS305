import { adminDB, adminMail, adminJWT } from "./admin.js";
import bcrypt from "bcrypt";
import {problem,blog,comments} from "./Components/schema.js";
import pkg from "jsonwebtoken";
import { ObjectId } from "mongodb";
const { TokenExpiredError} = pkg;

export default class Helper {
  
  static userLogin = async (req, res) => {
    // type 0 student
    // type 1 coordinator
    // type 2 admin
    // Working fine
    try {
      // extract data from request body
      const email = req.body.email;
      const password = req.body.password;
      // find user in database
      const user = await adminDB.findOne(
        adminDB.users,
        { email: email },
        {
          password: 1,
          type: 1,
          handle: 1,
        }
      );
      if (user) {
        bcrypt.compare(password, user.password, function (_err, result) {
          if (result) {
            // if password matches then send success response
            const token = adminJWT.createToken(email, user.handle,user.type);
            res.send({
              success: true,
              message: "Login Successful",
              type: user.type,
              userToken: token,
            });
          } else {
            // if password does not match then send error response
            res.send({ success: false, message: "Invalid Email or Password" });
          }
        });
      } else {
        // if user does not exist then send error response
        res.send({ success: false, message: "Invalid Email or Password" });
      }
    } catch (error) {
      res.send({ success: false, message: error });
    }
  };
  static updateProfile = async (req, res) => {
    // extract data from request body
    // Working fine
    try {
      const token = req.body.userToken;
      const email = adminJWT.verifyToken(token).email;
      const city = req.body.city;
      const country = req.body.country;
      const birthdate = req.body.birthdate;
      const address = req.body.address;
      // check if user exists
      const user = await adminDB.findOne(adminDB.users, { email: email });
      if (user) {
        // if user exists then update the profile
        await adminDB.updateOne(
          adminDB.users,
          { email: email },
          {
            $set: {
              city: city,
              country: country,
              birthdate: birthdate,
              address: address,
            },
          }
        );
        res.send({ success: true, message: "Profile Updated Successfully" });
      } else {
        // if user does not exist then send error response
        res.send({ success: false, message: "User does not exists" });
      }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        // handle the token expired error here
        console.log('Token has expired');
        res.send({success:false,message:"Token has expired."})
      } else {
        // handle other errors here
        console.log('Error:', err);
        res.send({success:false,message:"Profile Updation Failed."})
      }
    }
  };
  static fillDetails = async (req, res) => {
    // extract data from request body
    // working fine
    try {
      const email = req.body.email;
      const password = req.body.password;
      const name = req.body.name;
      const handle = req.body.handle;
      const type = "0";
      // check if user already exists
      const user = await adminDB.findOne(adminDB.users, { email: email });
      if (user) {
        res.send({ success: false, message: "User already exists" });
      } else {
        if (
          email === "" ||
          password === "" ||
          name === "" ||
          handle === "" ||
          type === ""
        ) {
          res.send({ success: false, message: "Please fill all the details." });
          return;
        }
        bcrypt.hash(password, 10, function (_err, hash) {
          // Store hash in your password DB.
          adminDB.insertOne(adminDB.users, {
            email: email,
            password: hash,
            name: name,
            handle: handle,
            type: type,
            city: null,
            country: null,
            birthdate: null, // date of birth of the format YYYY-MM-DD
            address: null, // complete address
          });
        });

        // if user does not exist then register the user

        res.send({
          success: true,
          message: "User Registered Successfully",
        });
      }
    } catch (error) {
      res.send({ success: false, message: "User Registration Failed" });
    }
  };
  static verifyOTP = async (req, res) => {
    // extract data from request body
    try {
      const email = req.body.email;
      const otp = req.body.otp;
      const user = await adminDB.findOne(adminDB.otp, { email: email });
      if (user && user.otp == otp) {
        // if OTP matches then send success response
        await adminDB.deleteOne(adminDB.otp, { email: email });
        res.send({ success: true, message: "OTP Verified Successfully" });
      } else {
        // if OTP does not match then send error response
        res.send({ success: false, message: "Invalid OTP" });
      }
    } catch (error) {
      res.send({ success: false, message: "OTP Verification Failed." });
    }
  };
  static sendOTP = async (req, res) => {
    try {
      // extract data from request body
      console.log(req.body);
      const email = req.body.email;
      // ask Yadwinder whether to use jwt here
      // check if user already exists
      const user = await adminDB.findOne(adminDB.users, { email: email });
      if (user) {
        // if user exists then send error response
        res.send({ success: false, message: "User already exists" });
      } else {
        // if user does not exist then register the user
        // send the random OTP to the user
        const otp = Math.floor(Math.random() * 1000000);
        console.log("OTP: " + otp);
        adminMail.sendOTP(email, otp);
        const checkOTP = await adminDB.findOne(adminDB.otp, { email: email });
        if (checkOTP) {
          await adminDB.updateOne(
            adminDB.otp,
            { email: email },
            { $set: { otp: otp } }
          );
        } else {
          await adminDB.insertOne(adminDB.otp, { email: email, otp: otp });
        }
        res.send({ success: true, message: "OTP Sent Successfully" });
      }
    } catch (error) {
      res.send({ success: false, message: "OTP generation failed." });
    }
  };
  static getPostRequest = async (_req, res) => {
    const data = await adminDB.find(adminDB.problem, {
      status: "pending",
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static verifyPostRequest = async (req, res) => {
    let postId = req.body.postId;
    let response = req.body.response;
    const data = await adminDB.updateOne(
      adminDB.problem,
      {
        _id: new ObjectId(postId),
      },
      {
        status: response,
      }
    );
    if (data) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  };
  static postBlog = async (req, res) => {
    try {
      // working fine
      let token = req.body.userToken;
      let decodeData = adminJWT.verifyToken(token);
      let handle = decodeData.handle;
      let type = decodeData.type;
      let Blog = new blog(req.body);
      Blog.handle = handle;
      Blog.type = type;
      Blog.comments = [];
      const data = await adminDB.insertOne(adminDB.blog, Blog);
      if (data) {
        res.send({ success: true,message:"Blog posted." });
      } else {
        res.send({ success: false,message:"Blog cannot be posted due to internal error." });
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // handle the token expired error here
        console.log('Token has expired');
        res.send({success:false,message:"Token has expired."})
      } else {
        // handle other errors here
        console.log('Error:', error);
        res.send({success:false,message:"Blog posting failed."})
      }
    }
  };
  static commentBlog = async (req, res) => {
    // working fine
    try {
      let token = req.body.userToken;
      let decodeData = adminJWT.verifyToken(token);
      let blogId = req.body.blogId;
      let handle = decodeData.handle;
      let comment = req.body.comment;
      let timestamp = req.body.timestamp;
      let Comment = new comments({handle:handle,comment:comment,timestamp:timestamp});
      const data = await adminDB.updateOne(
        adminDB.blog,
        { _id: new ObjectId(blogId) },
        {
          $push: {
            comments: Comment,
          },
        }
        );
        console.log(data);
      if (data.modifiedCount === 1) {
        res.send({ success: true,message:"Comment posted." });
      } else {
        res.send({ success: false,message:"Comment cannot be posted due to internal error." });
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // handle the token expired error here
        console.log('Token has expired');
        res.send({success:false,message:"Token has expired."})
      } else {
        // handle other errors here
        console.log('Error:', error);
        res.send({success:false,message:"Comment cannot be posted due to internal error."})
      } 
    }
  };
  static postProblem = async (req, res) => {
    // working fine
    // only need changes in the problem object
    try {
      let token = req.body.userToken;
      let decodeData = adminJWT.verifyToken(token);
      let author_email = decodeData.email;
      let author_type = decodeData.type;
      if (author_type === "0") {
        // if author is not admin or coordinator
        res.send({
          success: false,
          message: "You are not authorized to post problems.",
        });
        return;
      }
      let obj = { ...req.body, author_email: author_email };
      obj.token = undefined;
      let Problem = new problem(obj);
      const data = await adminDB.insertOne(adminDB.problem, Problem);
      if (data) {
        res.send({ success: true, message: "Problem posted successfully." });
      } else {
        res.send({ success: false,message:"Problem can't be posted due to internal reasons" });
      }
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: "Problem posting failed." });
    }
  };
  static postEditorial = async (req, res) => {
    let title = req.body.title;
    let author_email = req.body.author;
    let content = req.body.content;
    let date = req.body.date;
    let time = req.body.time;
    let problemId = req.body.problemId;
    const data = await adminDB.insertOne(adminDB.editorial, {
      title: title,
      author_email: author_email,
      content: content,
      date: date,
      time: time,
      problemId: problemId,
    });
    if (data) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  };
  
  static submitSolution = async (req, res) => {
    let problemId = req.body.problemId;
    let code = req.body.code;
    let email = req.body.email;
    let date = req.body.date;
    let time = req.body.time;
    let language = req.body.language;
    const data = await adminDB.insertOne(adminDB.solution, {
      code: code,
      email: email,
      date: date,
      time: time,
      problemId: problemId,
      language: language,
      verdict: "pending" //pending, accepted, wrong answer, time limit exceeded, runtime error, compilation error, memory limit exceeded
    });
    if (data) {
      //test the code here
      //write a method to update the verdict based on testings
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  };
  static getEditorials = async (req, res) => {
    let problemId = req.body.problemId;
    const data = await adminDB.find(adminDB.editorial, {
      problemId: problemId,
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static getBlogs = async (_req, res) => {
    const data = await adminDB.find(adminDB.blog,sort={"timestamp":-1});
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static fetchBlogComments = async (req, res) => {
    let blogId = req.body.blogId;
    const data = await adminDB.findOne(adminDB.blog, {
      _id: new ObjectId(blogId),
    });
    if (data) {
      res.send({ data: data.comments, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static fetchProblemSets = async (_req, res) => {
    const data = await adminDB.find(adminDB.problem, {
      status: "accepted",
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static getProblemDetails = async (req, res) => {
    let problemId = req.body.problemId;
    const data = await adminDB.findOne(adminDB.problem, {
      _id: new ObjectId(problemId),
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static viewEditorials = async (req, res) => {
    let problemId = req.body.problemlId;
    const data = await adminDB.findOne(adminDB.editorial, {
      _id: new ObjectId(problemId),
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static getVerdict = async (req, res) => {
    let problemId = req.body.problemId;
    const data = await adminDB.find(adminDB.solution, {
      problemId: problemId,
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  
}
