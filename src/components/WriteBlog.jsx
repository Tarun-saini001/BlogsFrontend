import React from 'react'
import { useNavigate } from "react-router-dom";

const WriteBlog = () => {
  const navigate = useNavigate();

  const handleWriteClick = () => {
    navigate("/addBlog");
  };
  return (
    <div>
      <button onClick={handleWriteClick} className='ml-[40%] text-amber-500  bg-black w-20 rounded-md'>Write</button>
    </div>
  )
}

export default WriteBlog
