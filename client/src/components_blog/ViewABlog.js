import React, { useState, useEffect } from 'react'
import { url } from '../components_shared/Request';
import { useParams } from 'react-router-dom';
import { getUserToken } from '../components_login/Token';
// import 


const ViewABlog = () => {
    const [comment, setComment] = useState("");
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    let blogtoken = useParams();

    function handleSubmit(event) {
        event.preventDefault();
        console.log(comment);
    }

    function handleChange(event) {
        setComment(event.target.value);
        console.log(comment);
    }
    async function fetchComments() {
        console.log("fetch comments");
        const response = await fetch(`${url}/getBlogComments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                blogId: blogtoken.id,
                lawda: "lawda"
            })
        })
        console.log("fetchwdefrgth comments");

        return response.json();
    }
    useEffect(() => {

        fetchComments().then((data) => {
            if (data.success) {
                setData(data.data);
                setIsLoading(false);
            }
        }).catch(e => {
            console.log(e)
        })
    }, [])
    async function postComment() {
        const response = await fetch(`${url}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment: comment,
                userToken: getUserToken(),
                Id: blogtoken.id,
                timestamp: new Date(),
                entityType: true,
            })

        });
        const data = await response.json();
        return data.success
    }

    async function handleSubmit(e) {
        e.preventDefault();
        // console.log(data);
        const posted = await postComment();
        console.log((comment))
        if (!posted) {
            alert("Error in posting comment");
        }
        else {
            alert("Comment Posted");
        }
    }

    return (
        <>
            {
                isLoading
                    ?
                    <></>
                    :
                    <div>
                        <article class="mr-12 ml-12 my-5 p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <div class="flex justify-between items-center mb-5 text-gray-500">
                                <span class="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                    <svg class="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                                    {data.type == 0 ? "student" : "admin"}
                                </span>
                                {/* <span class="text-sm">{data.content}</span> */}
                            </div>
                            <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">{data.title}</a></h2>
                            <p class="mb-5 font-light text-gray-500 dark:text-gray-400">{data.content}</p>
                            <div class="flex justify-between items-center">
                                <div class="flex items-center space-x-4">
                                    <img class="w-7 h-7 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png" alt="Jese Leos avatar" />
                                    <span class="font-medium dark:text-white">
                                        {data.handle}
                                    </span>
                                </div>
                            </div>
                        </article>

                        <section class="bg-white dark:bg-gray-900 py-8 lg:py-16">
                            <div class="max-w-2xl mx-auto px-4">
                                <div class="flex justify-between items-center mb-6">
                                    <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion</h2>
                                </div>
                                <form class="mb-6">
                                    <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                        <label for="comment" class="sr-only">Your comment</label>
                                        <textarea value={comment} onChange={handleChange} id="comment" rows="6"
                                            class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                            placeholder="Write a comment..." required></textarea>
                                    </div>
                                    <button type="button"
                                        // onClick={handleSubmi}
                                        // value={comment}
                                        onClick={handleSubmit}
                                        class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-dark-purple rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                                        Post comment
                                    </button>
                                </form>
                                <>
                                    {data && data.comments && data.comments.map((item) => (
                                        <article class="p-6 mb-6 text-base bg-white rounded-lg dark:bg-gray-900">
                                            <footer class="flex justify-between items-center mb-2">
                                                <div class="flex items-center">
                                                    <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white"><img
                                                        class="mr-2 w-6 h-6 rounded-full"
                                                        src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                                                        alt="Michael Gough" />{item.handle}</p>
                                                    <p class="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="2022-02-08"
                                                        title="February 8th, 2022">{item.timestamp}</time></p>
                                                </div>
                                                <button id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                                                    class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                                    type="button">
                                                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z">
                                                        </path>
                                                    </svg>
                                                    <span class="sr-only">Comment settings</span>
                                                </button>
                                                <div id="dropdownComment1"
                                                    class="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                                    <ul class="py-1 text-sm text-gray-700 dark:text-gray-200"
                                                        aria-labelledby="dropdownMenuIconHorizontalButton">
                                                        <li>
                                                            <a href="#"
                                                                class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                                                        </li>
                                                        <li>
                                                            <a href="#"
                                                                class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                                                        </li>
                                                        <li>
                                                            <a href="#"
                                                                class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </footer>
                                            <p class="text-gray-500 dark:text-gray-400">{item.comment}</p>
                                            <div class="flex items-center mt-4 space-x-4">
                                                <button type="button"

                                                    class="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                                                    <svg aria-hidden="true" class="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                                    Reply
                                                </button>
                                            </div>
                                        </article>
                                    ))
                                    }
                                </>
                            </div>
                        </section>
                    </div>
                // <p>hello</p>
            }

        </>
    )
}

export default ViewABlog
