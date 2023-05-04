import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { url } from '../components_shared/Request';
import { setUserToken, setRoleToken } from './Token';

const loginTemplate = {
    email: "",
    password: "",
}

export default function SignIn() {

    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState(loginTemplate);
    const [buttonSignIn, setButtonSignIn] = useState("Sign In");
    function getLoginUser(e) {
        const { name, value } = e.target;
        addLoginUser(name, value)
    }

    function addLoginUser(name, value) {
        setLoginUser(prevInfo => ({
            ...prevInfo,
            [name]: value
        }))
    }

    function checkInfo() {
        if (loginUser.email === null ||
            loginUser.password === null) {
            return false;
        }
        else {
            return true;
        }
    }

    async function login(e) {
        e.preventDefault();

        if (!checkInfo()) {
            window.alert("enter Credentials properly")
            return;
        }
        setButtonSignIn("Trying to Log you In");
        const response = await fetch(`${url}/userLogin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: loginUser.email, password: loginUser.password })
        })

        const data = await response.json();
        if (!data.success) {
            window.alert("Invalid Creds..");
            setButtonSignIn("Sign In");
            return;
        }

        const role = data.type;
        setUserToken(data.userToken);
        setRoleToken(role);
        if (role === "0") {
            // student
            navigate('/student')
        }
        else if (role === "1" || role === "2") {
            // coordinator or admin
            navigate('/admin')
        }
        else {

        }

    }

    return (
        <>
            <section className="bg-white mt-10 dark:bg-gray-900">
                <div className="container flex items-center justify-center  px-6 mx-auto">
                    <form className="w-full max-w-md">

                        <div className="flex items-center justify-center">
                            <Link to="/signin" className="w-1/3 pb-4 font-medium text-center text-gray-800 capitalize border-b-2 border-blue-500 dark:border-blue-400 dark:text-white">
                                Sign In
                            </Link>
                            <Link to="/signup" className="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b dark:border-gray-400 dark:text-gray-300">
                                Sign Up
                            </Link>

                        </div>





                        <div className="relative flex items-center mt-6">
                            <span className="absolute">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>

                            <input onChange={getLoginUser} value={loginUser.email} type="email" name="email" className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Email address" />
                        </div>



                        <div className="relative flex items-center mt-4">
                            <span className="absolute">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>

                            <input type="password" onChange={getLoginUser} value={loginUser.password} name="password" className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Password" />
                        </div>



                        <div className="mt-3">
                            <button onClick={login} className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                {buttonSignIn}
                            </button>


                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}

