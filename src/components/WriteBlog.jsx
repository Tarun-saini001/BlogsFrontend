import React from 'react'
import { useNavigate } from "react-router-dom";

const WriteBlog = () => {
  const navigate = useNavigate();

  const handleWriteClick = () => {
    navigate("/addBlog");
  };
  return (
    <div>
      <button onClick={handleWriteClick} className='bg-black text-white px-4 w-20 py-1 ml-120 rounded disabled:bg-gray-400'>Write</button>
    </div>
  )
}

export default WriteBlog
