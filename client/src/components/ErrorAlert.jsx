import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, AlertTriangle, Info } from "lucide-react";

export default function ErrorAlert({ 
  error, 
  type = "error", 
  onClose, 
  className = "",
  show = true 
}) {
  if (!error || !show) return null;

  const alertConfig = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: AlertCircle,
      iconColor: "text-red-500"
    },
    warning: {
      bg: "bg-yellow-50", 
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: AlertTriangle,
      iconColor: "text-yellow-500"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200", 
      text: "text-blue-800",
      icon: Info,
      iconColor: "text-blue-500"
    }
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`${config.bg} ${config.border} border rounded-lg p-4 ${className}`}
      >
        <div className="flex items-start">
          <Icon className={`${config.iconColor} h-5 w-5 mt-0.5 flex-shrink-0`} />
          <div className="ml-3 flex-1">
            <p className={`${config.text} text-sm font-medium`}>
              {error}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={`ml-3 ${config.text} hover:opacity-70 transition-opacity`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 