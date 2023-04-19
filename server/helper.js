import { adminDB, adminMail } from "./admin.js";
import bcrypt from "bcrypt";

export default class Helper {
  static userLogin = async (req, res) => {
    // extract data from request body
    const email = req.body.email;
    const password = req.body.password;
    // find user in database
    const user = await adminDB.findOne(
      adminDB.users,
      { email: email },
      { password: 1 }
    );
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          // if password matches then send success response
          res.status(200).json({ message: "Login Successful" });
        } else {
          // if password does not match then send error response
          res.status(400).json({ message: "Invalid Password" });
        }
      });
    } else {
      // if user does not exist then send error response
      res.status(400).json({ message: "Invalid Email" });
    }
  };
  static updateProfile = async (req, res) => {
    // extract data from request body
    const email = req.body.email;
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
          city: city,
          country: country,
          birthdate: birthdate,
          address: address,
        }
      );
      res.status(200).json({ message: "Profile Updated Successfully" });
    } else {
      // if user does not exist then send error response
      res.status(400).json({ message: "User does not exist" });
    }
  };
  static fillDetails = async (req, res) => {
    // extract data from request body
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const handle = req.body.handle;
    // check if user already exists
    const user = await adminDB.findOne(adminDB.users, { email: email });
    if (user) {
      res.status(400).json({ message: "User Already Exists" });
    } else {
      if (email === "" || password === "" || name === "" || handle === "") {
        res.status(400).json({ message: "Please fill all the details" });
      }
      bcrypt.hash(password, 10, function (err, hash) {
        // Store hash in your password DB.
        adminDB.insertOne(adminDB.users, {
          email: email,
          password: hash,
          name: name,
          handle: handle,
          city: null,
          country: null,
          birthdate: null, // date of birth of the format YYYY-MM-DD
          address: null, // complete address
        });
      });

      // if user does not exist then register the user

      res.status(200).json({ message: "Details filled successfully" });
    }
  };
  static verifyOTP = async (req, res) => {
    // extract data from request body
    const email = req.body.email;
    const otp = req.body.otp;
    console.log(email, typeof otp);
    const user = await adminDB.findOne(adminDB.otp, { email: email, otp: otp });
    if (user) {
      // if OTP matches then send success response
      await adminDB.deleteOne(adminDB.otp, { email: email });
      res.status(200).json({ message: "OTP Verified" });
    } else {
      // if OTP does not match then send error response
      res.status(400).json({ message: "Invalid OTP" });
    }
  };
  static sendOTP = async (req, res) => {
    // extract data from request body
    console.log(req.body);
    const email = req.body.email;
    // check if user already exists
    const user = await adminDB.findOne(adminDB.users, { email: email });
    if (user) {
      res.status(400).json({ message: "User Already Exists" });
    } else {
      // if user does not exist then register the user
      // send the random OTP to the user
      const otp = Math.floor(Math.random() * 1000000);
      await adminMail.sendOTP(email, otp);
      const checkOTP = await adminDB.findOne(adminDB.otp, { email: email });
      if (checkOTP) {
        await adminDB.updateOne(adminDB.otp, { email: email }, { otp: otp });
      } else {
        await adminDB.insertOne(adminDB.otp, { email: email, otp: otp });
      }
      res.status(200).json({ message: "OTP Sent successfully" });
    }
  };
}
