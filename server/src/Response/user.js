import { adminDB, adminMail, adminJWT } from "../Utility/admin.js";
import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
import { ObjectId } from "mongodb";
const { TokenExpiredError, JsonWebTokenError } = pkg;

export default class User {
  static userLogin = async (req, res) => {
    // type 0 student
    // type 2 admin
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
            const token = adminJWT.createToken(email, user.handle, user.type);
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
  }; // working fine
  static getUserDetails = async (req, res) => {
    let token = req.body.userToken;
    try {
      let decoded = adminJWT.verifyToken(token);
      let email = decoded.email;
      let user = await adminDB.findOne(
        adminDB.users,
        { email: email },
        { password: 0, _id: 0 }
      );
      if (user) {
        res.send({ success: true, message: "User Details", user: user });
      } else {
        res.send({ success: false, message: "User does not exists" });
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // handle the token expired error here
        console.log("Token has expired");
        res.send({ success: false, message: "Token has expired." });
      } else if (error instanceof JsonWebTokenError) {
        // handle other errors here
        res.send({
          success: false,
          message: "User has logged out.Kindly login again",
        });
      } else {
        res.send({ success: false, message: error.message });
      }
    }
  }; // working fine
  static updateProfile = async (req, res) => {
    // extract data from request body
    try {
      const token = req.body.userToken;
      const email = adminJWT.verifyToken(token).email;
      const city = req.body.city;
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
        console.log("Token has expired");
        res.send({ success: false, message: "Token has expired." });
      } else {
        // handle other errors here
        console.log("Error:", err);
        res.send({ success: false, message: "Profile Updation Failed." });
      }
    }
  }; // working fine
  static fillDetails = async (req, res) => {
    // extract data from request body
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
        bcrypt.hash(password, 10, function (err, hash) {
          // Store hash in your password DB.
          if(err){
            res.send({success:false,message:"User Registration Failed due to some internal error."});
            return;
          }
          else{
            adminDB.insertOne(adminDB.users, {
              email: email,
              password: hash,
              name: name,
              handle: handle,
              type: type,
              city: null,
              birthdate: null, // date of birth of the format YYYY-MM-DD
              address: null, // complete address
            });
            adminDB.insertOne(adminDB.solved,{handle: handle, solved:[]});
            res.send({
                success: true,
                message: "User Registered Successfully",
              });
            return;
        }
        });

        // if user does not exist then register the user

       
      }
    } catch (error) {
      res.send({ success: false, message: "User Registration Failed" });
    }
  }; // working fine
  // sendOTP and verifyOTP are used for email verification
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
  }; // working fine
  static sendOTP = async (req, res) => {
    try {
      // extract data from request body
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
  }; // working fine
  static changePassword = async (req, res) => {
    // extract data from request body
    try {
      let email = req.body.email;
      let newPassword = req.body.newPassword;
      let data = await adminDB.findOne(adminDB.users, { email: email });
      if (data) {
        bcrypt.hash(newPassword, 10, function (err, hash) {
          // Store hash in your password DB.
          if(err){
            res.send({
              success: false,
              message: "Password Updation Failed due to some internal error.",
            });
            return;
          }
          else
            adminDB.updateOne(
              adminDB.users,
              { email: email },
              { $set: { password: hash } }
            );
            res.send({ success: true, message: "Password Changed Successfully." });
        });
      } else {
        res.send({ success: false, message: "User does not exists." });
      }
    } catch (error) {
      res.send({
        success: false,
        message: "Password Updation Failed due to some internal error.",
      });
    }
  }; // working fine
  static userLogout = async (req, res) => {
    // extract data from request body
    try {
      const token = req.body.userToken;
      const email = adminJWT.verifyToken(token).email;
      const user = await adminDB.findOne(adminDB.users, { email: email });
      if (user) {
        // if user exists then send success response
        // token has to be stored as the jwt token on the client side
        res.send({
          success: true,
          message: "User Logged Out Successfully",
          userToken: "",
        });
      } else {
        // if user does not exist then send error response
        res.send({ success: false, message: "User does not exists" });
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // handle the token expired error here
        res.send({ success: false, message: "User has been logged out." });
      } else if (error instanceof JsonWebTokenError) {
        // handle other errors here
        res.send({
          success: false,
          message: "User has logged out.Kindly login again",
        });
      } else {
        res.send({ success: false, message: error.message });
      }
    }
  }; // working fine
  static getAllHandles = async (req, res) => {
    // extract data from request body
    
    try {
      const users = await adminDB.find(adminDB.users, {});
      let handles = [];
      for (let i = 0; i < users.length; i++) {
        handles.push(users[i].handle);
      }
      res.send({ success: true, message: "All Handles", handles: handles });
    } catch (error) {
      res.send({ success: false, message: "Error in fetching handles" });
    }
  } // working fine
}
