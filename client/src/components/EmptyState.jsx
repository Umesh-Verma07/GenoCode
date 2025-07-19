import { motion } from "framer-motion";
import { FolderOpen, Search, Code, User, AlertCircle } from "lucide-react";

export default function EmptyState({ 
  type = "default", 
  title = "No data found", 
  description = "There's nothing to show here yet.",
  action,
  className = "" 
}) {
  const iconConfig = {
    default: { icon: FolderOpen, color: "text-gray-400" },
    search: { icon: Search, color: "text-gray-400" },
    problems: { icon: Code, color: "text-blue-400" },
    profile: { icon: User, color: "text-green-400" },
    error: { icon: AlertCircle, color: "text-red-400" }
  };

  const config = iconConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <div className={`${config.color} mb-4`}>
        <Icon className="h-16 w-16" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>
      <p className="text-gray-500 text-center max-w-md mb-6">
        {description}
      </p>
      {action && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
} 