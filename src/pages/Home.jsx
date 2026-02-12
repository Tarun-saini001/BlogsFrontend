import React from 'react'
import WriteBlog from '../components/WriteBlog'

const Home = () => {
  return (
    <div className='bg-amber-200 h-screen '>
     <div className='  h-[70%] w-full  bg-[url(./img/home.jpg)] bg-cover flex justify-center space-y-6 flex-col'>
        <p className='text-amber-500 text-3xl font-bold ml-[25%]'>Welcome<br /> To Intresting Blogs</p>
        <WriteBlog/>
     </div>

    </div>
  )
}

export default Home
