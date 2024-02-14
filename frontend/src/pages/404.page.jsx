import React from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../imgs/404.png'
function PageNotFound() {
    const navigate = useNavigate();
    const handleBackToHome = () => {  
    navigate("/");
    }
return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-900 bg-[#000000]">
        <img src={logo} alt="" className='h-80 w-80 '/>
        <p className=" mb-4 text-xl text-white">Page Not Found</p>
        <button 
            onClick={handleBackToHome} 
            className="px-4 py-2 text-white hover:bg-[#701818] bg-[#47090A] rounded-3xl"
        >
            Back to Home
        </button>
    </div>
)
}

export default PageNotFound