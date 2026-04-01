import { motion } from "framer-motion";
import { FaTrophy, FaCalendarAlt, FaClock, FaUsers, FaCode } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contest() {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow px-4 sm:px-6 navbar-spacing pb-12">
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 70, duration: 0.7 }}
                    className="text-center mb-8 max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-800 via-primary-600 to-orange-500 dark:from-indigo-200 dark:via-indigo-300 dark:to-orange-300 drop-shadow mb-4">
                        Contests
                    </h1>
                    <p className="text-xl text-primary-900/80 dark:text-slate-300 max-w-2xl mx-auto">
                        Compete with fellow coders, solve challenging problems, and climb the leaderboard
                    </p>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="glass-card rounded-3xl p-8 sm:p-12 max-w-4xl w-full mx-auto"
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
                            className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg rounded-full p-8 mb-8 inline-flex items-center justify-center"
                        >
                            <FaTrophy size={60} className="text-white drop-shadow-lg" />
                        </motion.div>
                        
                        <h2 className="text-3xl font-bold text-primary-900 dark:text-slate-100 mb-4">
                            No Contests Scheduled Yet
                        </h2>
                        
                        <p className="text-primary-900/70 dark:text-slate-300 text-lg mb-8 leading-relaxed">
                            We're working hard to bring you exciting coding contests! 
                            Check back soon for upcoming competitions where you can test your skills 
                            against other programmers.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col items-center p-4 bg-white/70 dark:bg-slate-900/75 rounded-xl border border-primary-100 dark:border-indigo-200/20"
                            >
                                <FaCalendarAlt size={32} className="text-primary-700 mb-3" />
                                <h3 className="font-semibold text-primary-900 dark:text-slate-100 mb-2">Regular Events</h3>
                                <p className="text-sm text-primary-900/70 dark:text-slate-300 text-center">
                                    Weekly and monthly contests with varying difficulty levels
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col items-center p-4 bg-white/70 dark:bg-slate-900/75 rounded-xl border border-primary-100 dark:border-indigo-200/20"
                            >
                                <FaClock size={32} className="text-primary-700 mb-3" />
                                <h3 className="font-semibold text-primary-900 dark:text-slate-100 mb-2">Time-Based</h3>
                                <p className="text-sm text-primary-900/70 dark:text-slate-300 text-center">
                                    Race against time to solve problems efficiently
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col items-center p-4 bg-white/70 dark:bg-slate-900/75 rounded-xl border border-primary-100 dark:border-indigo-200/20"
                            >
                                <FaUsers size={32} className="text-primary-700 mb-3" />
                                <h3 className="font-semibold text-primary-900 dark:text-slate-100 mb-2">Leaderboards</h3>
                                <p className="text-sm text-primary-900/70 dark:text-slate-300 text-center">
                                    Compete with others and see your ranking
                                </p>
                            </motion.div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/practice")}
                                className="bg-gradient-to-r from-primary-700 to-primary-800 hover:from-primary-800 hover:to-primary-900 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center"
                            >
                                <FaCode className="mr-2" />
                                Practice Problems
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/")}
                                className="bg-white dark:bg-slate-900 border-2 border-primary-500 dark:border-indigo-300/40 text-primary-700 dark:text-slate-100 hover:bg-primary-50 dark:hover:bg-slate-800 font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200"
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
                    <p className="text-primary-700 dark:text-indigo-300 text-sm">
                        Want to be notified when contests are available? 
                        <span className="font-semibold cursor-pointer hover:underline ml-1">
                            Stay tuned for updates!
                        </span>
                    </p>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
} 