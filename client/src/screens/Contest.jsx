import { motion } from "framer-motion";
import { FaTrophy, FaCalendarAlt, FaClock, FaUsers, FaCode } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Contest() {
    const navigate = useNavigate();
    
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-[#fef7e0] via-[#fef3c7] to-[#fde68a] flex flex-col items-center justify-center px-4 py-12 navbar-spacing">
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 70, duration: 0.7 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 drop-shadow mb-4">
                        Contests
                    </h1>
                    <p className="text-xl text-yellow-700 max-w-2xl mx-auto">
                        Compete with fellow coders, solve challenging problems, and climb the leaderboard
                    </p>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-2xl w-full border border-yellow-200"
                >
                    <div className="text-center">
                        <motion.div
                            animate={{ 
                                rotate: [0, -10, 10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                rotate: { repeat: Infinity, duration: 3 },
                                scale: { repeat: Infinity, duration: 2, delay: 1 }
                            }}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg rounded-full p-8 mb-8 inline-flex items-center justify-center"
                        >
                            <FaTrophy size={60} className="text-white drop-shadow-lg" />
                        </motion.div>
                        
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            No Contests Scheduled Yet
                        </h2>
                        
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            We're working hard to bring you exciting coding contests! 
                            Check back soon for upcoming competitions where you can test your skills 
                            against other programmers.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200"
                            >
                                <FaCalendarAlt size={32} className="text-yellow-600 mb-3" />
                                <h3 className="font-semibold text-gray-800 mb-2">Regular Events</h3>
                                <p className="text-sm text-gray-600 text-center">
                                    Weekly and monthly contests with varying difficulty levels
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200"
                            >
                                <FaClock size={32} className="text-yellow-600 mb-3" />
                                <h3 className="font-semibold text-gray-800 mb-2">Time-Based</h3>
                                <p className="text-sm text-gray-600 text-center">
                                    Race against time to solve problems efficiently
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200"
                            >
                                <FaUsers size={32} className="text-yellow-600 mb-3" />
                                <h3 className="font-semibold text-gray-800 mb-2">Leaderboards</h3>
                                <p className="text-sm text-gray-600 text-center">
                                    Compete with others and see your ranking
                                </p>
                            </motion.div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/practice")}
                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center"
                            >
                                <FaCode className="mr-2" />
                                Practice Problems
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/")}
                                className="bg-white border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200"
                            >
                                Back to Home
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="mt-8 text-center"
                >
                    <p className="text-yellow-700 text-sm">
                        Want to be notified when contests are available? 
                        <span className="font-semibold cursor-pointer hover:underline ml-1">
                            Stay tuned for updates!
                        </span>
                    </p>
                </motion.div>
            </div>
        </>
    );
} 