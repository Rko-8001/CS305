import React from 'react'

export default function EditProfile(props) {

    const { editInfo, getEditInfo, getNewInfo, newInfo, updateInfo } = props;
    return (
        <>

            {/* <!-- Main modal --> */}
            <div tabindex="-1" aria-hidden="true" className={` ${editInfo ? "" : "hidden "} fixed mt-10  p-10 overflow-y-auto overflow-x-hidden z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full`}>
                <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                    {/* <!-- Modal content --> */}
                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        {/* <!-- Modal header --> */}
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Update Profile Info
                            </h3>
                            <button type="button" onClick={getEditInfo} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateProductModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* <!-- Modal body --> */}
                        <form action="#">
                            <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                <div>
                                    <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Birthday</label>
                                    <input onChange={getNewInfo} type="text" name="birthdate" id="name" value={newInfo.birthdate} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="12-12-2012" />
                                </div>
                                {/* <div>
                                    <label for="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mobile No.</label>
                                    <input type="text" name="brand" id="brand" value="7710603791" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ex. Apple" />
                                </div> */}
                                <div>
                                    <label for="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                    <input onChange={getNewInfo} type="text" value={newInfo.address} name="address" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="IIT Ropar" />
                                </div>
                                <div>
                                    <label for="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                                    <input onChange={getNewInfo} type="text" value={newInfo.city} name="city" id="catergory" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ropar" />
                                </div>
                                {/* <div>
                                    <label for="categor" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
                                    <input onChange={getNewInfo} type="number" value={newInfo.country} name="country" id="categor" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$299" />
                                </div> */}
                                {/* <div className="sm:col-span-2">
                                    <label for="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">More About You</label>
                                    <textarea id="description" rows="5" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write a description...">
                                    </textarea>
                                </div> */}
                            </div>
                            <div className="flex items-center space-x-4">
                                <button type="button" onClick={updateInfo} className="text-blue-600 inline-flex items-center hover:text-white border border-blue-600 hover:bg-black focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            </div >
        </>
    )
}
