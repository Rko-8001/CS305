

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { url } from '../../components_shared/Request';
import { getUserToken } from '../../components_login/Token';



import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-error_marker';
import SpecficProblemSkeleton from '../../components_skeleton/SpecficProblemSkeleton';



const ViewAProblem = () => {

    let problemToken = useParams();

    const [subButton,setButton] = useState("Submit");
    const [problemData, setProblemData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLang, setSelectedLang] = useState("C++");
    // const [code, setCodeChange] = useState("")
    const [code, setCode] = useState("// Code goes here");

    const handleLanguageChange = (event) => {
        setSelectedLang(event.target.value);
        console.log("changed")
        if(selectedLang==='C++'){
        selectedLang('Java')}
    };

    const handleCodeChange = (newValue) => {
        setCode(newValue);
        console.log(code)
    };

    const handleAnnotations = (annotations) => {
        if (annotations.length > 0) {
            annotations.forEach((annotation) => {
                console.log(annotation);
            });
        }
    };

    async function fetchProblem() {
        const response = await fetch(`${url}/fetchProblemDetails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                problemId: problemToken.id,
                aisehi: "aisehi"
            })
        })
        return response.json();
    }

    async function SubmitSolution() {
        const response = await fetch(`${url}/submitSolution`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                problemId: problemToken.id,
                userToken: getUserToken(),
                code: code,
                handle: "",
                timestamp: new Date(),
                language: selectedLang,
            })
        });

        const data = await response.json();
        return data.success;
    }
    

    async function handleSubmit(e) {
        console.log(code);
        console.log("Submitting");
        setButton("Submitting.");
        const submited = await SubmitSolution();
        if (!submited) {
            alert("Error");
        }
        else {
            alert("Accepted");
        }
    }


    useEffect(() => {

        fetchProblem().then((data) => {
            if (data.success) {
                setProblemData(data.problem);
                setCode(data.problem.function_def_CPP);
                if (data.problem) {
                    setIsLoading(false);
                }

            }
        })
    }, [])




    return (
        <>
            {
                isLoading
                    ?
                    <SpecficProblemSkeleton />
                    :
                    <div className="grid grid-cols-2 h-screen">
                        <div className="bg-gray-200">
                            <section class="bg-white dark:bg-gray-900">
                                <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
                                    <div class="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
                                        <h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">{problemData.title}</h2>
                                        <p>time limit per test: {problemData.time_limit} seconds</p>
                                        <p>memory limit per test: 256 megabytes</p>
                                        <p>input: standard input</p>
                                        <p>output: standard output</p>
                                        <br />
                                        <p class="font-light">{problemData.content}</p>
                                        <br />
                                        <br />
                                        <p class="font-light"> <b>Input Format</b></p>
                                        <p class="font-light">{problemData.input_format}</p>
                                        <br />
                                        <p class="font-light"> <b>Output Format</b></p>
                                        <p class="font-light">{problemData.output_format}</p>
                                        <br />
                                        <p>Examples</p>
                                        <br />
                                        <div class="flex">
                                            <div class="flex flex-col w-1/2 h-32 p-4 border border-gray-400 rounded-md mr-4">
                                                <div class="flex flex-1 border-b border-gray-400">
                                                    <div class="flex-1 p-2">
                                                        <h1 class="text-lg font-bold">Input</h1>
                                                        <p class="text-gray-500">{problemData.example_input}</p>
                                                    </div>

                                                </div>

                                            </div>
                                            <div class="flex flex-col w-1/2 h-32 p-4 border border-gray-400 rounded-md">
                                                <div class="flex flex-1 border-b border-gray-400">
                                                    <div class="flex-1 p-2">
                                                        <h1 class="text-lg font-bold">Output</h1>
                                                        <p class="text-gray-500">{problemData.example_output}</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </section>
                        </div>
                        <div>
                            <select id="lang" onChange={handleLanguageChange} class="my-2 border-2 bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="C++">C++</option>
                                <option value="Java">Java</option>
                            </select>

                            <div className=" w-full h-full">
                                <AceEditor
                                    mode="c_cpp"
                                    width=""
                                    theme="monokai"
                                    value={code}
                                    onChange={handleCodeChange}
                                    name="code-editor"
                                    editorproblemData={{ $blockScrolling: true }}
                                    setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                        showLineNumbers: true,
                                        tabSize: 2,
                                        useWorker: true,
                                        useSoftTabs: true,
                                    }}
                                    markers={[
                                        {
                                            startRow: 2,
                                            startCol: 3,
                                            endRow: 2,
                                            endCol: 6,
                                            className: 'error-marker',
                                            type: 'background',
                                        },
                                    ]}
                                    annotations={[
                                        {
                                            row: 2,
                                            column: 4,
                                            text: 'error message',
                                            type: 'error',
                                        },
                                    ]}
                                    onAnnotationsChange={handleAnnotations}
                                />
                                <div class="flex">
                                    <div class="w-1/2 p-4 border-4">
                                        <label for="textarea1">Input</label>
                                        <textarea id="textarea1" class="w-full border-2"></textarea>
                                    </div>
                                    <div class="w-1/2 p-4 border-4">
                                        <label for="textarea2">Output</label>
                                        <textarea id="textarea2" class="w-full border-2"></textarea>
                                    </div>
                                </div>
                                {/* <button type="submit" class="my-1 ml-5 bg-blue-500 text-white py-2 px-4 rounded">
                                    Test the code
                                </button> */}
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    class="my-1 ml-5 bg-blue-500 text-white py-2 px-4 rounded">
                                    {subButton}
                                </button>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default ViewAProblem
