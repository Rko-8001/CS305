import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import Otp from './Otp';
import SignUpCreds from './SignUpCreds';
import { url } from '../components/Request';

export default function SignUp() {
    const [goOtp, setGoOtp] = useState(false);

    const [userInfo, setUserInfo] = useState({
        "name": "",
        "handle": "",
        "email": "",
        "password": "",
        "cpassword": "",
    })

    function getUserInfo(e) {
        const { name, value } = e.target;

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

        if (!checkInfo()) {
            window.alert("Please fill properly");
            return;
        }
        //logic
        // const router = `${url}/sendOTP`;
        // console.log(router);
        const email = userInfo.email;
        const removeerror = "aisehi";
        const response = await fetch(`${url}/sendOTP`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, removeerror})
        });
        console.log(response);
        // setGoOtp(true);
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
                                <Otp userInfo={userInfo} />
                                :
                                <SignUpCreds getUserInfo={getUserInfo} userInfo={userInfo} verifyEmail={verifyEmail} />
                        }
                    </form>
                </div>
            </section>
        </>
    )
}
