import React from 'react'
import { useParams } from 'react-router-dom'

export default function ViewAProblem() {

    const problemId = useParams();
    return (
        <>
            <h1>
                This is the  {problemId.id}
            </h1>
        </>
    )
}
