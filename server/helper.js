import { adminDB, adminMail,adminJWT } from "./admin.js";
import bcrypt from "bcrypt";

export default class Helper {
  static reGenerateToken = (req, res) => {
    // Working fine
    // function to re-generate jwt token
    try{
      const email = req.body.email;
      const type = req.body.type;
      const newToken = adminJWT.createToken(email, type);
      res.send({ success: true, token: newToken });
    }
    catch(err){
      res.send({ success: false, message: err });
    }
  } 

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
         type: 1
       }
     );
     if (user) {
       bcrypt.compare(password, user.password, function (_err, result) {
         if (result) {
           // if password matches then send success response
           const token = adminJWT.createToken(email, user.type);
           res.send({ success: true, message: "Login Successful", "type": user.type, token: token });
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
    try{
      const token = req.body.token;
      const {email,type} = adminJWT.decodeToken(token);
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
          $set:{
            city: city,
            country: country,
            birthdate: birthdate,
            address: address,
          }
        }
        );
      res.send({ success: true, message: "Profile Updated Successfully" });
    } else {
      // if user does not exist then send error response
      res.send({ success: false, message: "User does not exists" });
    }
  }
  catch(err){
    res.send({ success: false, message: err });
  }
  };
  static fillDetails = async (req, res) => {
    // extract data from request body
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
      if (email === "" || password === "" || name === "" || handle === "" || type === "") {
        res.send({ success: false, message: "Please fill all the details." });
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

      res.send({ success: true, message: "User Registered Successfully" });
    }
  };
  static verifyOTP = async (req, res) => {
    // extract data from request body
    const email = req.body.email;
    const otp = req.body.otp;
    console.log(email, typeof otp);
    const user = await adminDB.findOne(adminDB.otp, { email: email });
    if (user && user.otp == otp) {
      // if OTP matches then send success response
      await adminDB.deleteOne(adminDB.otp, { email: email });
      res.send({ success: true, message: "OTP Verified Successfully" })
    } else {
      // if OTP does not match then send error response
      res.send({ success: false, message: "Invalid OTP" });
    }
  };
  static sendOTP = async (req, res) => {
    // extract data from request body
    console.log(req.body);
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
        await adminDB.updateOne(adminDB.otp, { email: email }, { otp: otp });
      } else {
        await adminDB.insertOne(adminDB.otp, { email: email, otp: otp });
      }
      res.send({ success: true, message: "OTP Sent Successfully" });
    }
  };
  static getPostRequest = async (_req, res) => {
    const data = await adminDB.find(adminDB.problem, {
      status: "pending"
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
    const data = await adminDB.updateOne(adminDB.problem, {
      _id: new ObjectId(postId)
    }, {
      status: response
    });
    if (data) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  };
  static postBlog = async (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let author_email = req.body.author;
    let date = req.body.date;
    let time = req.body.time;
    let links = req.body.links;
    const data = await adminDB.insertOne(adminDB.blog, {
      title: title,
      content: content,
      author_email: author_email,
      date: date,
      time: time,
      links: links
    });
    if (data) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  };
  static postProblems = async (req, res) => {
    let title = req.body.title;
    let author_email = req.body.author;
    let content = req.body.content;
    let time_limit = req.body.time_limit;
    let memory_limit = req.body.memory_limit;
    let input_format = req.body.input_format;
    let output_format = req.body.output_format;
    let example_input = req.body.example_input;
    let example_output = req.body.example_output;
    let testcases = req.body.testcases;
    let date = req.body.date;
    let time = req.body.time;
    const data = await adminDB.insertOne(adminDB.problem, {
      title: title,
      author_email: author_email,
      content: content,
      time_limit: time_limit,
      memory_limit: memory_limit,
      input_format: input_format,
      output_format: output_format,
      example_input: example_input,
      example_output: example_output,
      testcases: testcases,
      date: date,
      time: time,
      status: "pending"
    });
    if (data) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  };
  static postEditorials = async (req, res) => {
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
      problemId: problemId
    });
    if (data) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  };
  static commentBlog = async (req, res) => {
    let comment = req.body.comment;
    let email = req.body.email;
    let date = req.body.date;
    let time = req.body.time;
    let blogId = req.body.blogId;
    const data = await adminDB.updateOne(
      adminDB.blog,
      { _id: new ObjectId(blogId) },
      { $push: { comments: { comment: comment, email: email, date: date, time: time } } }
    );
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
    });
    if (data) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  };
  static getEditorials = async (req, res) => {
    let problemId = req.body.problemId;
    const data = await adminDB.find(adminDB.editorial, {
      problemId: problemId
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static getBlogs = async (_req, res) => {
    const data = await adminDB.find(adminDB.blog, {});
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static fetchBlogComments = async (req, res) => {
    let blogId = req.body.blogId;
    const data = await adminDB.findOne(adminDB.blog, {
      _id: new ObjectId(blogId)
    });
    if (data) {
      res.send({ data: data.comments, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static fetchProblemSets = async (_req, res) => {
    const data = await adminDB.find(adminDB.problem, {
      status: "accepted"
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
      _id: new ObjectId(problemId)
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
      _id: new ObjectId(problemId)
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
}
