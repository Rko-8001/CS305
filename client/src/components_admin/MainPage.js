import React, { useEffect, useState } from 'react'
import { getUserToken } from '../components_login/Token';
import AddProblem from './addContent/problems/AddProblem'

export default function MainPage() {

    const [user, setUser] = useState("");
    useEffect(() => {
        setUser(getUserToken);
    }, [])

    return (
        <>
            <h2>
                Hello, {user}
                <AddProblem/>
            </h2>
        </>
    )
}
