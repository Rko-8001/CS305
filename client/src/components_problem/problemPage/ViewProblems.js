import React from 'react'

export default function ViewProblems() {
  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold  tracking-tight text-black">Practice Problems</h1>
          <p className="text-xl  text-gray-800">Enchance your coding skills</p>

        </div>
      </header>

      <div>
        <div class="mx-4 sm:mx-8 px-4 sm:px-8 py-4 overflow-x-auto ">
          <div class="inline-block min-w-full shadow rounded-lg overflow-hidden ">
            <div class="grid grid-cols-6 gap-4 px-5 py-3 border-b-2 border-gray-200 hover:bg-green-100 bg-white text-left  font-semibold text-gray-600 uppercase tracking-wider">
              <div class="col-start-1 col-end-3 ...">
                <h1>
                  Sum of Array
                </h1>
              </div>
              <div class="col-end-7 col-span-2 float-right">
                <h1 className=' text-green-900   leading-tight'>
                  <button class="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">Solve</button>
                  {/* <button class="bg-green-300 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">SOLVED</button> */}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
