import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getRoleToken, removeRoleToken, removeUserToken } from '../../components_login/Token';

const publicRoutes = [
    { name: "Home", link: "/" },
    { name: "Sign In", link: "/signin" },
    { name: "Sign Up", link: "/signup" },
]
const studentRoutes = [
    { name: "Home", link: "/student" },
    { name: "Practice", link: "/problem" },
    { name: "Blogs", link: "/blog" },
    { name: "Logout", link: "/" },
]

const coordinatorRoutes = [
    { name: "Home", link: "/admin" },
    { name: "Add Blog", link: "/admin/addBlog" },
    { name: "Add Problem", link: "/admin/addProblem" },
    { name: "Problems", link: "/problem" },
    { name: "Logout", link: "/" },
]

function NavBar() {

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openClass, setOpenClass] = useState("opacity-0 -translate-x-full");
    const [routes, setRoutes] = useState(publicRoutes);

    function routeHandler(name, link) {
        if (name === 'Logout') {
            removeRoleToken();
            removeUserToken();
        }
        navigate(link);
    }


    useEffect(() => {

        const role = getRoleToken();
        if (role === "0")
            setRoutes(studentRoutes);
        else if (role === "1" || role === "2")
            setRoutes(coordinatorRoutes);
        else
            setRoutes(publicRoutes);
    }, [])


    return (
        <>
            <nav x-data={open} className="relative bg-black text-white shadow ">
                <div className="container px-6 py-4 mx-auto">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="flex items-center justify-between">

                            <div className="flex lg:hidden ">
                                <button x-cloak onClick={(e) => {
                                    if (open) {
                                        setOpen(false);
                                        setOpenClass("opacity-0 -translate-x-full")
                                    }
                                    else {
                                        setOpen(true);
                                        setOpenClass("translate-x-0 opacity-100");
                                    }
                                }}
                                    type="button" className="text-yellow-800 hover:text-yellow-800 dark:hover:text-yellow-800 focus:outline-none focus:text-white dark:focus:text-white" aria-label="toggle menu">
                                    <svg x-show={!open} xmlns="http://www.w3.org/2000/svg"
                                        className={` ${!open ? " " : "hidden "} w-6 h-6`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
                                    </svg>

                                    <svg x-show={open} xmlns="http://www.w3.org/2000/svg"
                                        className={` ${open ? " " : "hidden "} w-6 h-6`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div x-cloak
                            className={` ${openClass} absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out  lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center`}>
                            <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
                                {routes.map((item, index) =>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            routeHandler(item.name, item.link);
                                        }}
                                        key={index}
                                        className="px-3 py-2 mx-3 mt-2 text-white hover:text-black hover:bg-white transition-colors duration-300 transform rounded-md lg:mt-0 "
                                    >
                                        {item.name}
                                    </button>
                                )}
                            </div>

                            {/* <div className="flex items-center mt-4 lg:mt-0">
                                <button className="hidden mx-4 text-gray-600 transition-colors duration-300 transform lg:block dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400 focus:outline-none" aria-label="show notifications">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>

                                <button type="button" className="flex items-center focus:outline-none" aria-label="toggle profile dropdown">
                                    <div className="w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full">
                                        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80" className="object-cover w-full h-full" alt="avatar" />
                                    </div>

                                    <h3 className="mx-2 text-gray-700 dark:text-gray-200 lg:hidden">Your Profile</h3>
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar