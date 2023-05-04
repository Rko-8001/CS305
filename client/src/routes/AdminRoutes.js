/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getRoleToken, getUserToken } from '../components_login/Token';

function AdminRoutes({ Component }) {

    const navigate = useNavigate();
    useEffect(() => {

        const userToken = getUserToken();
        const role = getRoleToken();
        if (!userToken || (role !== "2" && role !== "1")) {
            navigate("/error");
        }
    }, []);

    return (
        <>
            {Component}
        </>
    )
}

export default AdminRoutes