import { Int32 } from "mongodb";
import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        validate: (value) => {
            return validator.isEmail(value);
          }
    },
    password : {
        type : String,
        required:true
    },
    name : {
        type : String,
        required : true
    },
    type : {
        type : Int32,
        required : true
    },
    handle : {
        type : String,
        required : true,
        unique : true
    },
    city: {
        type : String,
    },
    country: {
        type : String,
    },
    birthdate: {
        type : Date,
    },
    address: {
        type : String,
    },
});

const Users = mongoose.model("User", UserSchema);

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => {
            return validator.isEmail(value);
          }
    },
    otp: {
        type: String,
        required: true
    }
});

const otp = mongoose.model("otp", otpSchema);

export { Users, otp };