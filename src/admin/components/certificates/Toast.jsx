import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};

export const Toast = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgColor = {
    success: "bg-green-900/20 border-green-500/30",
    error: "bg-red-900/20 border-red-500/30",
    info: "bg-blue-900/20 border-blue-500/30"
  }[type];

  const textColor = {
    success: "text-green-400",
    error: "text-red-400",
    info: "text-blue-400"
  }[type];

  const Icon = {
    success: Check,
    error: AlertCircle,
    info: AlertCircle
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center gap-3 rounded-lg border ${bgColor} px-4 py-3`}
    >
      <Icon size={18} className={textColor} />
      <span className="text-sm font-medium text-slate-100">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-auto text-slate-400 hover:text-slate-200"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <AnimatePresence>
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onRemove} />
        ))}
      </div>
    </AnimatePresence>
  );
};
