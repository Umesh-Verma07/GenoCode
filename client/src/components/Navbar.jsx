import logo from '../assets/logo.png'
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
export default function () {

    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [theme, setTheme] = useState('light');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

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
        setMobileMenuOpen(false);
    }

    const navItemClass = (path) => {
        const active = location.pathname === path;
        return `px-4 py-2 rounded-full text-sm md:text-base font-semibold transition ${active
            ? 'bg-white/20 text-white shadow-md'
            : 'text-white/85 hover:text-white hover:bg-white/10'
        }`;
    }

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        localStorage.setItem('theme', nextTheme);
    }

    const goTo = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    }

    return (
        <nav className="fixed w-full z-20 top-0 start-0 px-3 sm:px-5 pt-3">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3 rounded-2xl border border-white/20 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 dark:from-slate-950 dark:via-[#111936] dark:to-[#1a2856] shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
                        <img src={logo} className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg" alt="OJ" />
                        <span className="self-center text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap text-white tracking-tight">GenoCode</span>
                    </button>
                    
                    <button 
                        onClick={() => goTo("/practice")} 
                        className={`hidden md:inline-flex ${navItemClass('/practice')}`}
                    >
                        Practice
                    </button>
                    
                    <button 
                        onClick={() => goTo("/contest")} 
                        className={`hidden md:inline-flex ${navItemClass('/contest')}`}
                    >
                        Contests
                    </button>
                </div>

                <div className="flex items-center space-x-2 ml-auto">
                    <button
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className="md:hidden h-10 w-10 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="h-10 w-10 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center"
                        aria-label="Toggle theme"
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
                    </button>

                    {localStorage.getItem("authToken") ? (
                        <>
                            {localStorage.getItem('isAdmin') === "true" && (
                                <button 
                                    onClick={() => navigate('/create', { state: { from: location.pathname } })}
                                    className="hidden sm:inline-flex bg-amber-300 text-primary-900 hover:bg-amber-200 mr-2 font-semibold rounded-xl text-sm px-4 py-2 text-center shadow-md"
                                > 
                                    Add Problem
                                </button>
                            )}

                            <div className="relative" ref={dropdownRef}>
                                <img src={localStorage.getItem("userImage") || "/avatar-placeholder.png"} alt="profile"
                                    className="w-10 h-10 rounded-full border-2 border-white/90 shadow-lg cursor-pointer"
                                    onClick={() => setDropdownOpen(prev => !prev)}
                                />
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
                                        <button onClick={handleProfile} className="block w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"> Profile </button>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-300 font-medium"> Logout </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center">
                            <button 
                                onClick={() => navigate("/login", { state: { from: location.pathname } })} 
                                className="bg-white text-primary-700 hover:bg-slate-100 dark:bg-slate-100 dark:text-primary-900 mr-1 font-semibold rounded-xl text-sm px-3 sm:px-4 py-2 text-center shadow-md"
                            > 
                                Login 
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden mt-2 w-full max-w-7xl mx-auto rounded-2xl border border-white/20 bg-primary-900/95 dark:bg-slate-950/95 backdrop-blur-xl p-3 space-y-2">
                    <button onClick={() => goTo('/practice')} className="w-full text-left px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 font-medium">Practice</button>
                    <button onClick={() => goTo('/contest')} className="w-full text-left px-3 py-2 rounded-lg text-white/90 hover:bg-white/10 font-medium">Contests</button>
                    {localStorage.getItem('authToken') && localStorage.getItem('isAdmin') === 'true' && (
                        <button onClick={() => goTo('/create')} className="w-full text-left px-3 py-2 rounded-lg text-amber-200 hover:bg-amber-400/10 font-medium">Add Problem</button>
                    )}
                </div>
            )}
        </nav>
    )
}
