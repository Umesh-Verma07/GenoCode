import { motion } from "framer-motion";

export default function LoadingSpinner({ 
  size = "md", 
  color = "primary", 
  text = "", 
  className = "" 
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  const colorClasses = {
    primary: "text-primary-600",
    white: "text-white",
    gray: "text-gray-600",
    green: "text-green-600"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </motion.div>
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
} 