import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const Header = () => {

    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    console.log(searchTerm)
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFormUrl = urlParams.get('searchTerm');
        // console.log(searchTermFormUrl)

        if (searchTermFormUrl) {
            setSearchTerm(searchTermFormUrl)
        }
    }, [location.search])

    // console.log(currentUser)
    return (
        <header className='bg-slate-200 shadow-md '>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>

                <Link to="/">

                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-500'>MH19</span>
                        <span className='text-slate-700'>ESTATE</span>
                    </h1>
                </Link>

                <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input type="text" placeholder='search' className='focus:outline-none bg-transparent w-24 sm:w-64'
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>

                <ul className='flex gap-4  sm:text-xl items-center '>
                    <Link to="/">
                        <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>Home</li>
                    </Link>
                    <Link to="/about">

                        <li className='text-slate-700 hover:underline cursor-pointer'>About</li>
                    </Link>
                    <Link to="/profile">

                        {
                            currentUser ? (
                                <img className='w-10 h-10 rounded-full object-cover' src={currentUser.avatar} alt="photo" />
                            ) : <li className='text-slate-700 hover:underline cursor-pointer'>Sign in</li>
                        }

                    </Link>

                </ul>
            </div>
        </header>
    )
}

export default Header