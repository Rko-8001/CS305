import React, { useEffect, useState } from 'react'
import { getUserToken } from '../components_login/Token';

export default function MainPage() {

    const [user, setUser] = useState("");
    useEffect(() => {
        setUser(getUserToken);
    }, [])

    return (
        <>
            <h2>
                Hello, {user}
            </h2>
        </>
    )
}
