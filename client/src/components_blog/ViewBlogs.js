import React, { useState, useEffect } from 'react';
import { url } from '../components_shared/Request';
import { getUserToken } from '../components_login/Token';
import { useNavigate } from 'react-router-dom';

const data = [];
const Blog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState(data);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchBlogs() {
        console.log("started..")
        const response = await fetch(`${url}/getBlogs`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        console.log("here")
        return response.json();
    }
    useEffect(() => {

        fetchBlogs().then((data) => {
            if (data.success) {
                setBlogs(data.data);
                setIsLoading(false);
                // if (data.data) {
                // }
            }
        }).catch(e => {
            console.log(e);
        })
    }, []);

    const [activeTab, setActiveTab] = useState(1);
    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };



    return (
        <>
            {
                isLoading ?
                    <>hehe</>
                    :
                    <div>

                        <section className="bg-white dark:bg-gray-900">
                            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                                <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
                                    <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Our Blog</h2>
                                    <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">Welcome to Blog section of coding club. We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>
                                </div>

                                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                                    <li className="mr-2">
                                        <a onClick={() => handleTabClick(0)} href="#" className="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active" aria-current="page">Show Important Blogs  </a>
                                    </li>
                                    <li className="mr-2">
                                        <a onClick={() => handleTabClick(1)} href="#" className="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">Show all Blogs</a>
                                    </li>

                                </ul>
                                <br />
                                <div className="grid gap-8 lg:grid-cols-2">

                                    {blogs.map((item, index) => (
                                        <article key={index} className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                                            <div className="flex justify-between items-center mb-5 text-gray-500">
                                                <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                                    <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                                                    {item.type === "0" ? "Student" : "Admin"}
                                                </span>
                                                <span className="text-sm">{item.data}</span>
                                            </div>
                                            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">{item.title}</a></h2>
                                            <p className="mb-5 font-light text-gray-500 dark:text-gray-400">{item.content}</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-4">
                                                    <img className="w-7 h-7 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png" alt="Jese Leos avatar" />
                                                    <span className="font-medium dark:text-white">
                                                        {item.username}
                                                    </span>
                                                </div>
                                                <button onClick={(e) => {
                                                    e.preventDefault();
                                                    const link = `/blog/${item._id}`
                                                    navigate(link);
                                                }} className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
                                                    Read more
                                                    <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

            }
        </>
    )
}

export default Blog
