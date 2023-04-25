import { createTransport } from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

// using nodemailer make a email class which sents OTP to the user from email from .env file
export default class Email {
  constructor() {

    this.sender = process.env.NODEMAILER_EMAIL;
    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.NODEMAILER_EMAIL, // replace with your email server username
        pass: process.env.NODEMAILER_PASSWORD, // replace with your email server password
      },
    }); // transporter is used to send mail
  }
  sendMail(receiver, subject, text) {
    
    let mailObj = {
      from: this.sender,
      to: receiver,
      subject: subject,
      text: text,
    };
    this.transporter.sendMail(mailObj, (err, _data) => {
      if (err) {
        console.log("The following error occured while sending mail.");
        throw new Error(err.message);
      } else {
        console.log("Message sent successfully.");
      }
    });
  }

  sendOTP = (email, otp) => {
    try{
      this.sendMail(email, "OTP", `Your OTP is ${otp}`);
    }
    catch(err){
      throw new Error(err.message);
    }
    // function to send OTP to the user
  }
}
