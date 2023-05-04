/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getRoleToken, getUserToken } from '../components_login/Token';

function StudentRoute({ Component }) {

    const navigate = useNavigate();
    useEffect(() => {

        const userToken = getUserToken();
        const role = getRoleToken();
        if (!userToken || role !== "0") {
            navigate("/error");
        }
    }, []);

    return (
        <>
            {Component}
        </>
    )
}

export default StudentRoute