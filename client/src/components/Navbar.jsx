import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'
export default function () {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("email");
        localStorage.setItem("isAdmin", false);
        navigate("/");
    }

    return (
        <nav className="fixed bg-primary-500 w-full z-20 top-0 start-0 border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-8 py-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={logo} className="h-8" alt="OJ" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">OnlineJudge</span>
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {
                        (localStorage.getItem("authToken")) ?
                            <div>
                                {((localStorage.getItem('isAdmin')) ? <a href="/create" className="bg-white text-primary-500 hover:bg-gray-100 mr-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center">Add Problem</a> : "")}
                                <a href="/" onClick={handleLogout} className="bg-white text-primary-500 hover:bg-gray-100 mr-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center">Logout</a>
                            </div>
                            :
                            <div>
                                <a href="/login" className="bg-white text-primary-500 hover:bg-gray-100 mr-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center">Login</a>
                                <a href="/register" className="bg-white text-primary-500 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center">Signup</a>
                            </div>
                    }
                </div>
            </div>
        </nav>
    )
}
