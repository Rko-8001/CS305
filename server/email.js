import {createTransport} from 'nodemailer';
// using nodemailer make a email class which sents OTP to the user from email from .env file
export default class Email {
    constructor(email,password) {
        console.log(password,password.length)
        console.log(email,email.length)
        this.sender = email;
        this.transporter = createTransport({
            service: "gmail",
            auth: {
              user: email, // replace with your email server username
              pass: password, // replace with your email server password
            },
          }); // transporter is used to send mail
    }
    sendMail(receiver, subject, text) 
        {
            let mailObj = {
                from: this.sender,
                to: receiver,
                subject: subject,
                text: text,
                };
            this.transporter.sendMail(mailObj, (err, _data) => {
                if (err) {
                  console.log("The following error occured while sending mail.");
                  console.log(err.message);
                } else {
                  console.log("Message sent successfully.");
                }
              });
        }

    sendOTP = async (email, otp) => {
        this.sendMail(email, "OTP", `Your OTP is ${otp}`); 
        // function to send OTP to the user
    }
}
