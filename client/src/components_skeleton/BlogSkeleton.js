/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react'

const BlogSkeleton = () => {

    return (
        <div>

            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
                        <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Our Blog</h2>
                        <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">Welcome to Blog section of coding club. We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>
                    </div>

                    <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                        <li className="mr-2">
                            <button className="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active" aria-current="page">Show Important Blogs  </button>
                        </li>
                        <li className="mr-2">
                            <button className="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">Show all Blogs</button>
                        </li>

                    </ul>
                    <br />
                    <div className="grid gap-8 lg:grid-cols-2 flex  bg-white rounded-lg shadow-lg animate-pulse dark:bg-gray-800">

                        <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-5 text-gray-500">
                                <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                    <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                                    <div className='w-20 h-2 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                </span>
                                <span className="text-sm">
                                    <div className='w-20 h-2 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                </span>
                            </div>
                            <h2 className="mb-2 mt-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                <div className='w-60 h-5 bg-gray-200 rounded-lg dark:bg-gray-700' />
                            </h2>
                            <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                                <div className='w-40 h-5 mt-3 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                <div className='w-40 h-5 mt-3 bg-gray-200 rounded-lg dark:bg-gray-700' />
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <span className="font-medium dark:text-white">
                                        <div className='w-20 h-2 mt-3 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                    </span>
                                </div>
                            </div>
                        </article>
                        <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-5 text-gray-500">
                                <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                    <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                                    <div className='w-20 h-2 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                </span>
                                <span className="text-sm">
                                    <div className='w-20 h-2 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                </span>
                            </div>
                            <h2 className="mb-2 mt-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                <div className='w-60 h-5 bg-gray-200 rounded-lg dark:bg-gray-700' />
                            </h2>
                            <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                                <div className='w-40 h-5 mt-3 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                <div className='w-40 h-5 mt-3 bg-gray-200 rounded-lg dark:bg-gray-700' />
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <span className="font-medium dark:text-white">
                                        <div className='w-20 h-2 mt-3 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                    </span>
                                </div>
                            </div>
                        </article>
                        <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-5 text-gray-500">
                                <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                    <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                                    <div className='w-20 h-2 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                </span>
                                <span className="text-sm">
                                    <div className='w-20 h-2 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                </span>
                            </div>
                            <h2 className="mb-2 mt-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                <div className='w-60 h-5 bg-gray-200 rounded-lg dark:bg-gray-700' />
                            </h2>
                            <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                                <div className='w-40 h-5 mt-3 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                <div className='w-40 h-5 mt-3 bg-gray-200 rounded-lg dark:bg-gray-700' />
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <span className="font-medium dark:text-white">
                                        <div className='w-20 h-2 mt-3 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                    </span>
                                </div>
                            </div>
                        </article>
                        <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-5 text-gray-500">
                                <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                    <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                                    <div className='w-20 h-2 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                </span>
                                <span className="text-sm">
                                    <div className='w-20 h-2 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                </span>
                            </div>
                            <h2 className="mb-2 mt-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                <div className='w-60 h-5 bg-gray-200 rounded-lg dark:bg-gray-700' />
                            </h2>
                            <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                                <div className='w-40 h-5 mt-3 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                <div className='w-40 h-5 mt-3 bg-gray-200 rounded-lg dark:bg-gray-700' />
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <span className="font-medium dark:text-white">
                                        <div className='w-20 h-2 mt-3 bg-gray-200 rounded-lg dark:bg-gray-700' />
                                    </span>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BlogSkeleton