import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import Otp from './Otp';
import SignUpCreds from './SignUpCreds';
import { url } from '../components_shared/Request';

const emptyInfo = {
    "name": "",
    "handle": "",
    "email": "",
    "password": "",
    "cpassword": "",
    "otp": "",
}
export default function SignUp() {

    const navigate = useNavigate();

    const [goOtp, setGoOtp] = useState(false);
    const [button, setButton] = useState("Verify Email");
    const [button2, setButton2] = useState("Sign Up");
    const [userInfo, setUserInfo] = useState(emptyInfo);

    function getUserInfo(e) {
        const { name, value } = e.target;
        addUserInfo(name, value);
    }

    const addUserInfo = (name, value) => {
        setUserInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }))
    }

    function checkInfo() {
        if (userInfo.name === null ||
            userInfo.handle === null ||
            userInfo.email === null ||
            userInfo.password !== userInfo.cpassword ||
            userInfo.password === null) {
            return false;
        }
        else {
            return true;
        }
    }

    async function verifyEmail(e) {
        e.preventDefault();
        if (button === "Verify Email") {
            setButton("Verifying..");
            if (!checkInfo()) {
                window.alert("Please fill properly");
                setButton("Verify Email");
                return;
            }

            const email = userInfo.email;
            const removeError = "aisehi";
            const response = await fetch(`${url}/sendOTP`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, removeError })
            });
            if (response.status === 200) {
                setGoOtp(true);
            }
            else {
                window.alert("Already Signed Up..");
                setButton("Verify Email");
            }
        }
    }

    async function verifyOTP() {

        const response = await fetch(`${url}/verifyOTP`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: userInfo.email, otp: userInfo.otp })
        });
        console.log(userInfo.otp);
        console.log(response);
        return (response.status === 200);
    }

    async function createUser() {
        const response = await fetch(`${url}/fillDetails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: userInfo.email,
                password: userInfo.password,
                handle: userInfo.handle,
                name: userInfo.name
            })

        });
        console.log(response);
        return (response.status === 200);
    }

    async function signUp(e) {
        e.preventDefault();
        if (userInfo.otp === null) {
            window.alert("Please enter otp..");
            return;
        }

        setButton2("Verifying OTP");

        const checkVerify = await verifyOTP();
        if (!checkVerify) {
            window.alert("Wrong OTP entered..");
            setButton2("Sign Up");
            addUserInfo("otp", "");
            return;
        }
        setButton2("OTP verified. Creating User..");

        const checkCreate = await createUser();
        if (!checkCreate) {
            window.alert("Error Occurred..");
            setButton2("Sign Up");
            setButton("Verify Email");
            setUserInfo(emptyInfo);
            setGoOtp(false);
            return;
        }

        setButton2("User Created..");
        navigate("/signin");

    }

    return (
        <>
            <section className="bg-white mt-10 dark:bg-gray-900">
                <div className="container flex items-center justify-center  px-6 mx-auto">
                    <form className="w-full max-w-md">


                        <div className="flex items-center justify-center">
                            <Link to="/signin" className="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b dark:border-gray-400 dark:text-gray-300">
                                Sign In
                            </Link>

                            <Link to="/signup" className="w-1/3 pb-4 font-medium text-center text-gray-800 capitalize border-b-2 border-blue-500 dark:border-blue-400 dark:text-white">
                                Sign Up
                            </Link>
                        </div>

                        {
                            goOtp
                                ?
                                <Otp userInfo={userInfo} getUserInfo={getUserInfo} text={button2} signUp={signUp} />
                                :
                                <SignUpCreds button={button} getUserInfo={getUserInfo} userInfo={userInfo} verifyEmail={verifyEmail} />
                        }
                    </form>
                </div>
            </section>
        </>
    )
}
