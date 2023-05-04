import React, { useEffect, useState } from 'react'
import { getUserToken } from '../components_login/Token';

import ViewAEditorial from '../components_blog/ViewAEditorial';

export default function MainPage() {

    const [user, setUser] = useState("");
    useEffect(() => {
        setUser(getUserToken);
    }, [])
    // for blog
    const blog1 = {
        handle: "adi_reign",
        title: "This our Test Blog 1",
        content: "Welcome to our first test blog 1",
        timestamp: "12/12/23",
        role: "0",
        Comments: [{handle: "adireign",content: "This is the test comment 1",timestamp: "12/12/12"},{handle: "adireign",content: "This is the test comment 2",timestamp: "12/12/12"}],
    }

    // for problem
    const problem1 = {
        handle: "Coordinator_1",
        title: "TubeTube Feed", 
        content: "Mushroom Filippov cooked himself a meal and while having his lunch, he decided to watch a video on TubeTube. He can not spend more than tseconds for lunch, so he asks you for help with the selection of video. The TubeTube feed is a list of n videos, indexed from 1to n. The i-th video lasts aiseconds and has an entertainment value bi. Initially, the feed is opened on the first video, and Mushroom can skip to the next video in 1second (if the next video exists).",
        correct_code_CPP: "",
        correct_code_JAVA: "",
        time_limit: "1",
        input_format: "The first line of the input data contains a single integer q(1≤q≤1000) — the number of test cases in the test.",
        output_format: "The first line of the input data contains a single integer q(1≤q≤1000) — the number of test cases in the test.",
        example_input: "5",
        example_output: "100",
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
    const editorial1 = {
        handle: "",
        content: "",
        Comment: [],
    }
    return (
        <>
            <h2>
                
                <ViewAEditorial props={blog1}/>
            </h2>
        </>
    )
}
