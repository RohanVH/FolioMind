import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Calendar, ExternalLink, Badge } from "lucide-react";

export const CertificateModal = ({ certificate, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && certificate && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 rounded-full bg-slate-800/50 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Image */}
              {certificate.image && (
                <div className="h-48 w-full overflow-hidden bg-slate-800">
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="space-y-4 p-6">
                {/* Icon & Title */}
                <div className="space-y-3">
                  {!certificate.image && (
                    <div className="flex justify-center">
                      <Award className="text-primary" size={40} />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-slate-100 text-center">
                    {certificate.title}
                  </h2>
                </div>

                {/* Skill Badge */}
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <Badge size={16} />
                    {certificate.skill}
                  </span>
                </div>

                {/* Date */}
                {certificate.date && (
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Calendar size={16} />
                    <span>
                      Earned on{" "}
                      {new Date(certificate.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                )}

                {/* Visibility Status */}
                {certificate.visible === false && (
                  <div className="rounded-lg bg-slate-700/30 border border-slate-600/50 px-3 py-2 text-center text-sm font-medium text-slate-300">
                    🔒 Hidden from Public View
                  </div>
                )}

                {/* Description if available */}
                {certificate.description && (
                  <p className="text-sm text-slate-300 text-center">{certificate.description}</p>
                )}

                {/* CTA Button */}
                <a
                  href={certificate.certificate_link || certificate.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-slate-950 hover:bg-primary/90 transition-all"
                >
                  <span>View Certificate</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
