import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

export const DeleteConfirmModal = ({ isOpen, title, onConfirm, onCancel, loading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-sm bg-slate-900 rounded-lg border border-white/10 shadow-xl">
              <div className="p-6 space-y-4">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-red-900/20 text-red-400">
                    <AlertCircle size={24} />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Delete Certificate?</h3>
                  <p className="text-sm text-slate-400">
                    Are you sure you want to delete <span className="font-medium text-slate-200">"{title}"</span>?
                  </p>
                  <p className="text-xs text-slate-500 mt-2">This action cannot be undone.</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 rounded-lg border border-white/10 px-4 py-2 font-medium text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 transition disabled:opacity-70"
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
