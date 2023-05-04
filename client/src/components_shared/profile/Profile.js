import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import Analytics from './Analytics';
import SideProfile from './SideProfile';
import EditProfile from './EditProfile';
import About from './About';
import { url } from '../Request';
import { getUserToken } from '../../components_login/Token';
import ProfileSkeleton from '../../components_skeleton/ProfileSkeleton';

export default function Profile() {
    const [userInfo, setUserInfo] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [editInfo, setEditInfo] = useState(false);
    const [updated, setUpdated] = useState(true);
    const [newInfo, setNewInfo] = useState({
        "address": "",
        "city": "",
        "country": "",
        "birthdate": "",
    });
    const [blogs, setBlogs] = useState();


    function getNewInfo(e) {
        const { name, value } = e.target;

        setNewInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }))
    }

    function getEditInfo(e) {
        e.preventDefault();
        setEditInfo(!editInfo);
    }

    async function updateInfo(e) {
        e.preventDefault();

        const response = await fetch(`${url}/updateProfile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    userToken: getUserToken(),
                    city: newInfo.city,
                    birthdate: newInfo.birthdate,
                    address: newInfo.address
                })
        })

        const data = await response.json();

        if (data.success) {
            setEditInfo(false);
            window.alert("Profile Updated.");
            setUpdated(!updated);
        }
        else {
            window.alert("Error Occured! Try Again..");
        }
    }

    async function fetchProfile(e) {
        const response = await fetch(`${url}/getUserDetails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userToken: getUserToken(), aisehi: "aisehi" })
        })
        return response.json();
    }

    async function fetchBlogs() {
        const response = await fetch(`${url}/getBlogs`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

        return response.json();
    }

    useEffect(() => {
        fetchProfile().then((data) => {

            setUserInfo(data.user);
            setIsLoading(false);
        }).catch((e) => {
            console.log(e);
        })
        fetchBlogs().then((data) => {
            setBlogs(data.data);
        }).catch((e) => {
            console.log(e);
        })

        setIsLoading(false);
    }, [updated])

    return (
        <>
            <Container maxWidth="xl">
                <div className="container mx-auto px-5 my-5 p-5">
                    <div className="md:flex no-wrap md:-mx-2 ">
                        {
                            isLoading ?
                                <ProfileSkeleton />
                                :
                                <>
                                    <SideProfile info={userInfo} load={isLoading} blogs={blogs} />
                                    <div className="w-full md:w-9/12 mx-2 h-64">
                                        <EditProfile
                                            editInfo={editInfo} getEditInfo={getEditInfo}
                                            newInfo={newInfo} getNewInfo={getNewInfo}
                                            updateInfo={updateInfo}
                                        />
                                        <div className="bg-white p-3 shadow-sm rounded-sm">
                                            <About info={userInfo} />
                                            <button onClick={getEditInfo}
                                                className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
                                            >
                                                Edit Information
                                            </button>
                                        </div>
                                        <div className="bg-white p-3">
                                            <Analytics />
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                </div>

            </Container>


        </>
    )
}
