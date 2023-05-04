import React, { useState } from 'react'

const ViewEditorials = () => {
    const Editorial1 = {
        id: "2020csb1063",
        username: "adi_reign",
        title: "This our Test Editorial 1",
        content: "Welcome to our first test Editorial 1",
        data: "12/12/23",
        role: "student",
    }
    const Editorial2 = {
        id: "2020csb1063",
        username: "adi_reign",
        title: "This our Test Editorial 2",
        content: "Welcome to our first test Editorial 2",
        data: "12/12/23",
        role: "student",
    }
    const Editorial3 = {
        id: "admin@iitrpr",
        username: "admin",
        title: "This our Test Editorial 3",
        content: "Welcome to our first test Editorial 3",
        data: "12/12/23",
        role: "admin",
    }
    const Editorial4 = {
        id: "coordinator1@iitrpr",
        username: "Coordi__1",
        title: "This our Test Editorial 4",
        content: "Welcome to our first test Editorial 4",
        data: "02/12/23",
        role: "Co-ordinator",
    }
    const arr = [];
    arr.push(Editorial1);
    arr.push(Editorial2);
    arr.push(Editorial3);

    const arr2 = [];
    arr2.push(Editorial3);
    arr2.push(Editorial4);
    const [activeTab,setActiveTab] = useState(1);
    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    return (
        <div>

            <section class="bg-white dark:bg-gray-900">
                <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div class="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
                        <h2 class="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Editorial</h2>
                        <p class="font-light text-gray-500 sm:text-xl dark:text-gray-400">Welcome to Editorial section of coding club. We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>
                    </div>

                    <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                        <li class="mr-2">
                            <a onClick={() => handleTabClick(0)} href="#" class="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active" aria-current="page">Show Important Editorials  </a>
                        </li>
                        <li class="mr-2">
                            <a onClick={() => handleTabClick(1)} href="#" class="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">Show all Editorials</a>
                        </li>
                        
                    </ul>
                    <br />
                    <div class="grid gap-8 lg:grid-cols-2">

                        {activeTab===1 && arr.map((item) => (
                            <article class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                                <div class="flex justify-between items-center mb-5 text-gray-500">
                                    <span class="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                        <svg class="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                                        {item.role}
                                    </span>
                                    <span class="text-sm">{item.data}</span>
                                </div>
                                <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">{item.title}</a></h2>
                                <p class="mb-5 font-light text-gray-500 dark:text-gray-400">{item.content}</p>
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center space-x-4">
                                        <img class="w-7 h-7 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png" alt="Jese Leos avatar" />
                                        <span class="font-medium dark:text-white">
                                            {item.username}
                                        </span>
                                    </div>
                                    <a href="#" class="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
                                        Show Complete Editoral
                                        <svg class="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                    </a>
                                </div>
                            </article>
                        ))}
                        {activeTab===0 && arr2.map((item) => (
                            <article class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                                <div class="flex justify-between items-center mb-5 text-gray-500">
                                    <span class="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                        <svg class="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                                        {item.role}
                                    </span>
                                    <span class="text-sm">{item.data}</span>
                                </div>
                                <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">{item.title}</a></h2>
                                <p class="mb-5 font-light text-gray-500 dark:text-gray-400">{item.content}</p>
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center space-x-4">
                                        <img class="w-7 h-7 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png" alt="Jese Leos avatar" />
                                        <span class="font-medium dark:text-white">
                                            {item.username}
                                        </span>
                                    </div>
                                    <a href="#" class="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
                                    Show Complete Editoral
                                        <svg class="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ViewEditorials
