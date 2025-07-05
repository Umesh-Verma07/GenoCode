import { motion } from "framer-motion";
import { FaCode, FaTrophy } from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function Home() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-[#e3eafe] via-[#dde8fd] to-[#f7f8fa] flex flex-col items-center justify-center px-4 py-12">
                <motion.h1
                    className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-400 drop-shadow mb-2 text-center"
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 70, duration: 0.7 }}
                >
                    Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-yellow-400">OnlineJudge</span>
                </motion.h1>
                <motion.p
                    className="text-xl md:text-2xl text-indigo-800 mb-14 mt-2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Keep Solving. Keep Growing. The Leaderboard Awaits You
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-3xl">
                    <motion.div
                        whileHover={{ scale: 1.07, y: -7, boxShadow: "0 8px 32px rgba(63,81,181,0.15)" }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer glass-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl flex flex-col items-center p-10 group border border-indigo-100 hover:border-indigo-400 transition-all duration-200"
                        onClick={() => (window.location.href = "/practice")}
                    >
                        <motion.div
                            animate={{ rotate: [0, 8, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="bg-indigo-600 shadow-lg rounded-full p-6 mb-6 flex items-center justify-center"
                        >
                            <FaCode size={44} className="text-white drop-shadow-lg" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-3 text-indigo-700 group-hover:text-indigo-800 transition">
                            Practice
                        </h2>
                        <p className="text-gray-700 text-center">
                            Solve handpicked coding problems and level up your DSA skills with instant feedback.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.07, y: -7, boxShadow: "0 8px 32px rgba(251,191,36,0.14)" }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer glass-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl flex flex-col items-center p-10 group border border-yellow-100 hover:border-yellow-400 transition-all duration-200"
                        onClick={() => (window.location.href = "/")}
                    >
                        <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2.2 }}
                            className="bg-yellow-400 shadow-lg rounded-full p-6 mb-6 flex items-center justify-center"
                        >
                            <FaTrophy size={44} className="text-white drop-shadow-lg" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-3 text-yellow-600 group-hover:text-yellow-700 transition"> Contests </h2>
                        <p className="text-gray-700 text-center"> Participate in live contests, compete with coders, and see your name on the leaderboard! </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
