import { adminDB,adminMail } from "./admin.js"

export default class Helper{

    static userLogin = async (req,res)=> {
        // extract data from request body
        const email = req.body.email;
        const password = req.body.password;
        // find user in database
        const user = await adminDB.findOne(adminDB.users,{email:email},{password:1});
        if(user){
            if(user.password === password){
                // if password matches then send success response
                res.status(200).json({message:"Login Successful"});
            }else{
                // if password does not match then send error response
                res.status(400).json({message:"Invalid Password"});
            }
        }else{
            // if user does not exist then send error response
            res.status(400).json({message:"Invalid Email"});
        }
    }
    static fillDetails = async (req,res) => {
        // extract data from request body
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const handle = req.body.handle;
        // check if user already exists
        const user = await adminDB.findOne(adminDB.users,{email:email});
        if(user){
            res.status(400).json({message:"User Already Exists"});
        }else{
            // if user does not exist then register the user
            await adminDB.insertOne(adminDB.users,{email:email,password:password,name:name,handle:handle});
            res.status(200).json({message:"Details filled successfully"});
        }
    }
    static verifyOTP = async (req,res) => {
        // extract data from request body
        const email = req.body.email;
        const otp = req.body.otp;
        const user = await adminDB.findOne(adminDB.otp,{email:email,otp:otp});
        if(user){
            // if OTP matches then send success response
            await adminDB.deleteOne(adminDB.otp,{email:email});
            res.status(200).json({message:"OTP Verified"});
        }else{
            // if OTP does not match then send error response
            res.status(400).json({message:"Invalid OTP"});
        }
    }
    static sendOTP = async (req,res)=>{
        // extract data from request body
        console.log(req.body)
        const email = req.body.email;
        // check if user already exists
        const user = await adminDB.findOne(adminDB.users,{email:email});
        if(user){
            res.status(400).json({message:"User Already Exists"});
        }else{
            // if user does not exist then register the user
            // send the random OTP to the user
            const otp = Math.floor(Math.random()*1000000);
            await adminMail.sendOTP(email,otp);
            await adminDB.insertOne(adminDB.otp,{email:email,otp:otp});
            res.status(200).json({message:"OTP Sent successfully"});
        }
    }
}