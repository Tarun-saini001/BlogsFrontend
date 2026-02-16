import React, { useContext } from 'react'
import WriteBlog from '../components/WriteBlog'
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className=' h-screen '>
     <div className='  h-[70%] w-full  bg-[url(./img/home.jpg)] bg-cover flex justify-center space-y-6 flex-col'>
        <p className='text-amber-500 text-3xl font-bold ml-[25%]'>Welcome<br /> To Intresting Blogs</p>
        {isLoggedIn && <WriteBlog />}
     </div>
    </div>
  )
}

export default Home
