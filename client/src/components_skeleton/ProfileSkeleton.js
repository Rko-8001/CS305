/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react'

export default function ProfileSkeleton() {
    return (
        <>
            <div class="w-full max-w-md mx-auto animate-pulse p-9  md:w-9/12 mx-2">
                <h1 class="h-2 bg-gray-300 rounded-lg w-52 dark:bg-gray-600"></h1>
                <p class="w-48 h-2 mt-6 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                <p class="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                <p class="w-64 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                <p class="w-4/5 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>
        </>
    )
}
