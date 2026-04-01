import { motion } from "framer-motion";
import { FaCode, FaTrophy, FaRocket, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));

  const handlePracticeClick = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/" } });
      return;
    }
    navigate("/practice");
  };

  const handleContestClick = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/" } });
      return;
    }
    navigate("/contest");
  };

  const handleStreakClick = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/" } });
      return;
    }
    const username = localStorage.getItem("username");
    navigate(username ? `/user/${username}` : "/practice");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow px-4 sm:px-6 navbar-spacing pb-12">
        <section className="max-w-7xl mx-auto rounded-[2rem] overflow-hidden border border-white/50 dark:border-indigo-200/20 shadow-2xl bg-gradient-to-br from-[#f8faff] via-[#ebf0ff] to-[#f4f7ff] dark:from-[#0c132b] dark:via-[#121b3c] dark:to-[#0d1630] relative">
          <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-orange-300/20 dark:bg-orange-400/15 blur-3xl" />
          <div className="absolute bottom-8 right-0 h-80 w-80 rounded-full bg-indigo-400/20 dark:bg-indigo-400/20 blur-3xl" />
          <div className="relative px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
            <motion.p
              className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-slate-900/70 px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide text-primary-700 dark:text-indigo-200 mb-6"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FaRocket className="text-orange-500" />
              Train. Compete. Ship better solutions.
            </motion.p>
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-primary-900 dark:text-slate-100 max-w-4xl"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 70, duration: 0.7 }}
            >
              Write smarter code with a platform built for serious practice.
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-primary-800/80 dark:text-slate-300 mt-6 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              GenoCode helps you move from solving random problems to building a focused routine with clear progress and competitive momentum.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <button
                onClick={handlePracticeClick}
                className="rounded-xl bg-primary-700 px-6 py-3 text-white font-semibold shadow-lg hover:bg-primary-800"
              >
                Start Practicing
              </button>
              <button
                onClick={handleContestClick}
                className="rounded-xl bg-white dark:bg-slate-900 dark:text-slate-100 text-primary-800 border border-primary-200 dark:border-indigo-200/25 px-6 py-3 font-semibold shadow-md hover:bg-primary-50 dark:hover:bg-slate-800"
              >
                Explore Contests
              </button>
            </motion.div>

            <motion.div
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              {["Structured practice sets", "Fast submissions and feedback", "Contest-ready mindset"].map((item) => (
                <div key={item} className="soft-surface rounded-xl px-4 py-3 text-sm sm:text-base text-primary-900 dark:text-slate-100 font-medium">
                  {item}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.99 }}
            className="cursor-pointer glass-card rounded-3xl flex flex-col p-8 group"
            onClick={handlePracticeClick}
          >
            <motion.div
              animate={{ rotate: [0, 7, -7, 0] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
              className="bg-primary-700 shadow-lg rounded-2xl p-5 mb-5 w-fit"
            >
              <FaCode size={34} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-3 text-primary-900 dark:text-slate-100">Practice Arena</h2>
            <p className="text-primary-800/80 dark:text-slate-300 text-base leading-relaxed">
              Build consistency with handpicked questions, clear difficulty filters, and a smooth solve-submit-review loop.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.99 }}
            className="cursor-pointer glass-card rounded-3xl flex flex-col p-8 group"
            onClick={handleContestClick}
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.6 }}
              className="bg-orange-500 shadow-lg rounded-2xl p-5 mb-5 w-fit"
            >
              <FaTrophy size={34} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-3 text-primary-900 dark:text-slate-100">Contest Zone</h2>
            <p className="text-primary-800/80 dark:text-slate-300 text-base leading-relaxed">
              Test your speed in timed rounds, benchmark your output, and push your rank with every contest.
            </p>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto mt-8">
          <div className="soft-surface rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wider text-primary-700 dark:text-indigo-300 font-semibold">Growth Snapshot</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-primary-900 dark:text-slate-100 mt-1">Small daily wins compound fast</h3>
            </div>
            <button
              onClick={handleStreakClick}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-3 text-white font-semibold w-fit hover:bg-primary-800 transition"
            >
              <FaChartLine />
              Keep your streak alive
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
