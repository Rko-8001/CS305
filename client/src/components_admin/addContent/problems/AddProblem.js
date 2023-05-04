import React, { useState } from 'react';
import classNames from 'classnames';
import { url } from '../../../components_shared/Request';
import { getUserToken } from '../../../components_login/Token';

function AddProblem() {
    const [title, setTitle] = useState('');
    const [info, setInfo] = useState('');
    const [content, setContent] = useState('');
    const [time_limit, setTime_limit] = useState(1);
    const [testcases, setTestcases] = useState('Sample here..');
    const [correct_code_CPP,setCorrect_code_CPP] = useState('');
    const [correct_code_JAVA,setCorrect_code_JAVA] = useState('');
    const [example_input,setExample_input] = useState('');
    const [example_output,setExample_output] = useState('');


    const problem_info = {
        handle: "admin",
        title: "",
        content: "",
        correct_code_CPP: "",
        correct_code_JAVA: "",
        time_limit: 1,
        input_format: "The first line of the input data contains a single integer q(1≤q≤1000) — the number of test cases in the test.",
        output_format: "The first line of the input data contains a single integer q(1≤q≤1000) — the number of test cases in the test.",
        example_input: "",
        example_output: "",
        input_template_CPP: "",
        function_def_JAVA: "",
        input_template_JAVA: "",
        testcases: "",
        timestamp: "",
        language: "",
        tags: "",
        level: "",
        status: "",
    }



    async function handleSubmit (e) {
        e.preventDefault();
        problem_info.title = title;
        problem_info.content = content;
        problem_info.correct_code_CPP = correct_code_CPP;
        problem_info.correct_code_JAVA = correct_code_JAVA;
        problem_info.example_input = example_input;
        problem_info.example_output = example_output;
        problem_info.testcases = testcases;
        
        const createProblemCheck = await createProblem();
        if(!createProblemCheck.success){
            alert(createProblemCheck.message)
        }
        else{
            alert(createProblemCheck.message);
        }



        // Do something with form data here, like sending it to an API
    };
    const handleChangeContent = (e) => {
        setContent(e.target.value)
    }
    const handleChangeCPP = (e) => {
        setCorrect_code_CPP(e.target.value);
    }
    const handleChangeJAVA = (e) => {
        setCorrect_code_JAVA(e.target.value);
    }
    const handleChangeExample_input = (e) => {
        setExample_input(e.target.value);
    }
    const handleChangeExample_output = (e) => {
        setExample_output(e.target.value);
    }


    async function createProblem() {
        const response = await fetch(`${url}/postProblem`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userToken: getUserToken(),
                title: problem_info.title,
                content: problem_info.content,
                correct_code_CPP: problem_info.correct_code_CPP,
                correct_code_JAVA: problem_info.correct_code_JAVA,
                time_limit: problem_info.time_limit,
                input_format: problem_info.input_format,
                output_format: "The first line of the input data contains a single integer q(1≤q≤1000) — the number of test cases in the test.",
                example_input: problem_info.example_input,
                example_output: problem_info.example_output,
                input_template_CPP: problem_info.input_template_CPP,
                function_def_JAVA: problem_info.output_format,
                input_template_JAVA: problem_info.input_template_JAVA,
                testcases: problem_info.testcases,
                timestamp: problem_info.timestamp,
                language: problem_info.language,
                tags: problem_info.tags,
                level: problem_info.level,
                status: problem_info.status,
            })

        });
        const data = await response.json();
        return data;
        console.log(response);
        // return (response.status === 200)
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <h2 className='font-bold py-2 my-2'>Post a new Problem</h2>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label htmlFor="title" className="my-2 block text-gray-700 font-bold mb-2">
                        Please Enter the Problem name
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
                    <textarea value={content} onChange={handleChangeContent} id="comment" rows="6"
                        class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="start with the statement..." required></textarea>
                </div>
                <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label for="comment" class="sr-only">Your comment</label>
                    <textarea value={correct_code_CPP} onChange={handleChangeCPP} id="comment" rows="6"
                        class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="place the correct CPP code here..." required></textarea>
                </div>
                <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label for="comment" class="sr-only">Your comment</label>
                    <textarea value={correct_code_JAVA} onChange={handleChangeJAVA} id="comment" rows="6"
                        class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="place the correct JAVA code here..." required></textarea>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label htmlFor="title" className="my-2 block text-gray-700 font-bold mb-2">
                        Enter the Time limit for the problem
                    </label>
                    <input
                        type="text"
                        id="time_limit"
                        value={time_limit}
                        onChange={(e) => setTime_limit(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label htmlFor="title" className="my-2 block text-gray-700 font-bold mb-2">
                        Enter the Testcases for the problem
                    </label>
                    <input
                        type="text"
                        id="testcases"
                        value={testcases}
                        onChange={(e) => setTestcases(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div class="my-4 py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border dark:bg-gray-800 dark:border-gray-700">
                    <label for="comment" class="sr-only">Your comment</label>
                    <textarea value={example_input} onChange={handleChangeExample_input} id="comment" rows="6"
                        class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="write example input..." required></textarea>
                </div>
                <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label for="comment" class="sr-only">Your comment</label>
                    <textarea value={example_output} onChange={handleChangeExample_output} id="comment" rows="6"
                        class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="write example output..." required></textarea>
                </div>
                <button type="button"
                    onClick={handleSubmit}
                    class="my-3 inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-dark-purple rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                    Post Problem
                </button>
            </form>



        </form>
    );
}
export default AddProblem;