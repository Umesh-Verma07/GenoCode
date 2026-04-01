import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

export default function AIReviewPanel({ show, onClose, reviewText, loading }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 250, damping: 30 }}
            className="relative w-[95vw] max-w-3xl rounded-3xl bg-white/95 dark:bg-slate-900/95 shadow-2xl border border-primary-100 dark:border-indigo-200/20 p-6 sm:p-8"
            style={{
              boxShadow:
                "0 4px 32px 4px rgba(70,120,255,0.10), 0 1.5px 15px rgba(30,64,175,0.10)",
              backdropFilter: "blur(8px)",
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md hover:bg-primary-100 dark:hover:bg-slate-700 transition"
              aria-label="Close"
            >
              <X size={22} className="text-gray-400 dark:text-slate-300 hover:text-red-500" />
            </button>

            <div className="flex items-center mb-3 gap-2">
              <span className="text-2xl font-extrabold text-primary-700 dark:text-indigo-300 drop-shadow">AI Review</span>
              <span className="inline-block bg-primary-100 dark:bg-indigo-500/20 text-primary-700 dark:text-indigo-200 text-xs rounded-full px-2 py-0.5 font-semibold shadow">Beta</span>
            </div>
            <p className="text-sm text-primary-900/70 dark:text-slate-300 mb-3">Quality-focused feedback on structure, clarity, and performance.</p>
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-primary-500 via-indigo-400 to-orange-400 mb-6" />

            <div className="overflow-y-auto max-h-[65vh] prose prose-sm md:prose-base dark:prose-invert max-w-none text-gray-800 dark:text-slate-200 custom-scroll pr-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-32 text-base text-gray-600 dark:text-slate-300">
                  <LoadingSpinner size="lg" color="primary" text="AI is analyzing your code..." />
                </div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{reviewText}</ReactMarkdown>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}