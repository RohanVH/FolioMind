import { Trash2, Edit2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export const CertificateList = ({ certificates = [], onEdit, onDelete, onToggleVisibility, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-700/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-white/10 p-12 text-center">
        <p className="text-slate-400">No certificates yet. Add your first certificate!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {certificates.map((certificate, index) => (
        <motion.div
          key={certificate._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`rounded-lg border p-4 transition-all ${
            certificate.visible
              ? "border-white/10 bg-slate-900/50"
              : "border-white/5 bg-slate-900/20 opacity-60"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-slate-100 truncate">{certificate.title}</h4>
                {!certificate.visible && (
                  <span className="inline-block px-2 py-1 text-xs bg-slate-600/30 text-slate-400 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mb-2">{certificate.skill}</p>
              {certificate.date && (
                <p className="text-xs text-slate-500">
                  {new Date(certificate.date).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onToggleVisibility(certificate._id, !certificate.visible)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
                title={certificate.visible ? "Hide" : "Show"}
              >
                {certificate.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                onClick={() => onEdit(certificate)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-primary"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(certificate._id)}
                className="p-2 hover:bg-red-900/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
