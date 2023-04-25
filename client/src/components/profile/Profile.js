import React from 'react'
import Container from '@mui/material/Container';
import Analytics from './Analytics';
import SideProfile from './SideProfile';

export default function Profile() {
    return (
        <>
            <Container maxWidth="xl">

                <div class="container mx-auto px-5 my-5 p-5">
                    <div class="md:flex no-wrap md:-mx-2 ">
                        <SideProfile />

                        {/* <!-- Right Side --> */}
                        <div class="w-full md:w-9/12 mx-2 h-64">
                            {/* <!-- Profile tab --> */}
                            {/* <!-- About Section --> */}
                            <div class="bg-white p-3 shadow-sm rounded-sm">
                                <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                                    <span clas="text-green-500">
                                        <svg class="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </span>
                                    <span class="tracking-wide">About</span>
                                </div>
                                <div class="text-gray-700">
                                    <div class="grid md:grid-cols-2 text-sm">
                                        <div class="grid grid-cols-2">
                                            <div class="px-4 py-2 font-semibold">Username</div>
                                            <div class="px-4 py-2">Adi_reign</div>
                                        </div>
                                        <div class="grid grid-cols-2">
                                            <div class="px-4 py-2 font-semibold">Name</div>
                                            <div class="px-4 py-2">Adish Lodha</div>
                                        </div>
                                        <div class="grid grid-cols-2">
                                            <div class="px-4 py-2 font-semibold">Email</div>
                                            <div class="px-4 py-2">
                                                <a class="text-blue-800" href="mailto:jane@example.com">jane@example.com</a>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-2">
                                            <div class="px-4 py-2 font-semibold">Birthday</div>
                                            <div class="px-4 py-2">+11 998001001</div>
                                        </div>
                                        <div class="grid grid-cols-2">
                                            <div class="px-4 py-2 font-semibold">Mobile No</div>
                                            <div class="px-4 py-2">Beech Creek, PA, Pennsylvania</div>
                                        </div>
                                        <div class="grid grid-cols-2">
                                            <div class="px-4 py-2 font-semibold">Address</div>
                                            <div class="px-4 py-2">Beech Creek, PA, Pennsylvania</div>
                                        </div>
                                        <div class="grid grid-cols-2">
                                            <div class="px-4 py-2 font-semibold">City</div>
                                            <div class="px-4 py-2">Arlington Heights, IL, Illinois</div>
                                        </div>


                                    </div>
                                </div>
                                <button
                                    class="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">Show
                                    Edit Information</button>
                            </div>
                            {/* <!-- End of about section --> */}

                            <div class="my-4"></div>

                            <div class="bg-white p-3">

                                <Analytics />
                            </div>
                        </div>
                    </div>
                </div>

            </Container>

        </>
    )
}
