import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Analytics from './Analytics';
import SideProfile from './SideProfile';
import EditProfile from './EditProfile';

export default function Profile() {
    const [editInfo, setEditInfo] = useState(false);

    function getEditInfo(e) {
        e.preventDefault();
        setEditInfo(!editInfo);
    }


    return (
        <>
            <Container maxWidth="xl">

                <div className="container mx-auto px-5 my-5 p-5">
                    <div className="md:flex no-wrap md:-mx-2 ">
                        <SideProfile />

                        <div className="w-full md:w-9/12 mx-2 h-64">

                            <EditProfile editInfo={editInfo} getEditInfo={getEditInfo} />

                            <div className="bg-white p-3 shadow-sm rounded-sm">
                                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                                    <span clas="text-green-500">
                                        <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </span>
                                    <span className="tracking-wide">About</span>
                                </div>
                                <div className="text-gray-700">
                                    <div className="grid md:grid-cols-2 text-sm">
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Username</div>
                                            <div className="px-4 py-2">Adi_reign</div>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Name</div>
                                            <div className="px-4 py-2">Adish Lodha</div>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Email</div>
                                            <div className="px-4 py-2">
                                                <a className="text-blue-800" href="mailto:jane@example.com">jane@example.com</a>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Birthday</div>
                                            <div className="px-4 py-2">+11 998001001</div>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Mobile No</div>
                                            <div className="px-4 py-2">Beech Creek, PA, Pennsylvania</div>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Address</div>
                                            <div className="px-4 py-2">Beech Creek, PA, Pennsylvania</div>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">City</div>
                                            <div className="px-4 py-2">Arlington Heights, IL, Illinois</div>
                                        </div>

                                    </div>
                                </div>

                                <button
                                    onClick={getEditInfo}
                                    className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
                                >
                                    Edit Information
                                </button>
                            </div>

                            <div className="bg-white p-3">
                                <Analytics />
                            </div>
                        </div>
                    </div>
                </div>

            </Container>

        </>
    )
}
