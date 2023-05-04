import React, { useState, useEffect } from 'react'
import { url } from '../../components_shared/Request';
import { useNavigate } from 'react-router-dom';
import ProblemSkeleton from '../../components_skeleton/ProblemSkeleton';
import { getRoleToken } from '../../components_login/Token';

export default function ViewProblems() {

  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchProblems() {
    const response = await fetch(`${url}/fetchAllProblems`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    return response.json();
  }

  const renderProblems = problems.map((problem, index) =>
    <li key={index} >
      <div className="mx-4 sm:mx-8 px-4 sm:px-8 py-4 overflow-x-auto ">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden ">
          <div className="grid flex-1 grid-cols-6 gap-4 px-5 py-3 border-b-2 border-gray-200 hover:bg-green-100 bg-white text-left  font-semibold text-gray-600 uppercase tracking-wider">
            <div className="col-start-1  col-end-3 ">
              <h1>
                {problem.title}
              </h1>
            </div>
            <div className=" col-end-7 col-span-2 float-right">
              <h1 className=' text-green-900    leading-tight'>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const link = `/problem/${problem._id}`
                    navigate(link);
                  }}
                  className="m-2 bg-indigo-600 px-4 py-2 rounded-md right text-white font-semibold tracking-wide cursor-pointer">
                  Solve
                </button>

                {
                  getRoleToken() === "2" || getRoleToken() === "1"
                    ?
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/admin/addEditorial/${problem._id}`);
                      }}
                      className="bg-indigo-600 px-4 py-2 rounded-md right text-white font-semibold tracking-wide cursor-pointer">
                      Post Editorial
                    </button>
                    :
                    <>
                    </>
                }
                {/* <button className="bg-green-300 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">SOLVED</button> */}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </li>
  )

  useEffect(() => {
    fetchProblems().then((data) => {
      setProblems(data.problems);
      setIsLoading(false);

    }).catch(e => {
      window.alert(e);
    })

  }, [])

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold  tracking-tight text-black">Practice Problems</h1>
          <p className="text-xl  text-gray-800">Enchance your coding skills</p>
        </div>
      </header>

      <div className='px-4'>
        {
          isLoading
            ?
            <ProblemSkeleton />
            :
            <ul>
              {renderProblems}
            </ul>
        }

      </div>
    </>
  )
}
