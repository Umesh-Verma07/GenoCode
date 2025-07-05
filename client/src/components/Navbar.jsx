import logo from '../assets/logo.png'
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
export default function () {

    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("userImage");
        navigate("/");
    }
    const handleProfile = () => {
        navigate(`/user/${localStorage.getItem("username")}`);
    }

    return (
        <nav className="fixed bg-primary-800 w-full z-20 top-0 start-0 border-b border-gray-200">
            <div className="w-full flex items-center justify-between px-8 py-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={logo} className="h-8" alt="OJ" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">OnlineJudge</span>
                </a>

                <div className="flex items-center space-x-2 ml-auto">
                    {localStorage.getItem("authToken") ? (
                        <>
                            {localStorage.getItem('isAdmin') === "true" && (
                                <a href="/create" className="bg-white text-primary-500 hover:bg-gray-100 mr-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"> Add Problem</a>
                            )}

                            <div className="relative" ref={dropdownRef}>
                                <img src={localStorage.getItem("userImage") || "/avatar-placeholder.png"} alt="profile"
                                    className="w-8 h-8 rounded-full border-2 border-white shadow cursor-pointer"
                                    onClick={() => setDropdownOpen(prev => !prev)}
                                />
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg z-50">
                                        <button onClick={handleProfile} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"> Profile </button>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"> Logout </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div>
                            <a href="/login" className="bg-white text-primary-500 hover:bg-gray-100 mr-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"> Login </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
