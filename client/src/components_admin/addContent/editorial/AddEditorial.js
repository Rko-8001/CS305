import React, { useState } from 'react';
import classNames from 'classnames';
import { url } from '../../../components_shared/Request';
import { getUserToken } from '../../../components_login/Token';
import { useParams } from 'react-router-dom';

function AddEditorial() {

    const objectProblem = useParams();
    const emptyEditorial = {
        "title": "",
        "content": "",
        "links": "",
    }
    const [title, setTitle] = useState('');
    const [info, setInfo] = useState('');
    const [content, setContent] = useState('');



    async function handleSubmit(e) {
        e.preventDefault();
        emptyEditorial.title = title;
        emptyEditorial.content = content;
        emptyEditorial.links = info;

        // alert(emptyBlog);

        const createEditorialCheck = await createEditoral();
        if (!createEditorialCheck.success) {
            alert(createEditorialCheck.message)
        }
        else {
            alert(createEditorialCheck.message);
        }


        // Do something with form data here, like sending it to an API
    };
    const handleChange = (e) => {
        setContent(e.target.value)


    }
    async function createEditoral() {
        const response = await fetch(`${url}/postEditorial`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userToken: getUserToken(),
                title: emptyEditorial.title,
                content: emptyEditorial.content,
                links: emptyEditorial.links,
                problemId: objectProblem.id,
            })

        });
        const data = await response.json();
        return data;
        console.log(response);
        // return (response.status === 200)
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <h2 className='font-bold py-2 my-2'>Post a new Editorial</h2>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label htmlFor="title" className="my-2 block text-gray-700 font-bold mb-2">
                        Please Enter the Editorial name
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label htmlFor="info" className="my-2 block text-gray-700 font-bold mb-2">
                        Please enter additional Info
                    </label>
                    <input
                        type="text"
                        id="info"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>

            <form class="mb-6">
                <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label for="comment" class="sr-only">Your comment</label>
                    <textarea value={content} onChange={handleChange} id="comment" rows="6"
                        class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Start the content..." required></textarea>
                </div>
                <button type="button"
                    onClick={handleSubmit}
                    class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-dark-purple rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                    Post Editorial
                </button>
            </form>



        </form>
    );
}
export default AddEditorial;