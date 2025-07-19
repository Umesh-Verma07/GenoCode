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
            className="relative w-[95vw] max-w-2xl rounded-3xl bg-green-50/95 shadow-2xl border border-green-300 p-8"
            style={{
              boxShadow:
                "0 4px 32px 4px rgba(70,120,255,0.10), 0 1.5px 15px rgba(30,64,175,0.10)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 bg-white rounded-full shadow-md hover:bg-primary-100 transition"
              aria-label="Close"
            >
              <X size={22} className="text-gray-400 hover:text-red-500" />
            </button>

            {/* Title and badge */}
            <div className="flex items-center mb-3 gap-2">
              <span className="text-2xl font-extrabold text-primary-700 drop-shadow">AI Review</span>
              <span className="inline-block bg-green-100 text-green-700 text-xs rounded-full px-2 py-0.5 font-semibold shadow">Beta</span>
            </div>
            {/* Accent line */}
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary-500 via-green-400 to-blue-400 mb-6" />

            <div className="overflow-y-auto max-h-[65vh] prose prose-sm md:prose-base text-gray-800 custom-scroll">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-32 text-base text-gray-600">
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