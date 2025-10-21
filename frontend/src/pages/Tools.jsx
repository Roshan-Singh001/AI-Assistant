import React from 'react'
import Navbar from '../components/Navbar'
import Aurora from '../components/Aurora'

const Tools = () => {
  return (
    <>
      <Navbar/>
      <div className="absolute inset-0 -z-10">
              <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={0.5}
                speed={0.8}
              />
              <div className="absolute inset-0 -z-20 bg-black"></div>
            </div>
      <div className='flex flex-col justify-center items-center mt-4'>
        <h1 className='text-4xl text-white font-bold'>Tools</h1>
        <div className='bg-white w-[7rem] mt-2 h-[0.1rem]'></div>
      </div>
    </>
  )
}

export default Tools