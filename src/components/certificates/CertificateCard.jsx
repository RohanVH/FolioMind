import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar } from "lucide-react";

export const CertificateCard = ({ certificate, onModal = null, index = 0 }) => {
  const handleClick = (e) => {
    if (onModal) {
      e.preventDefault();
      onModal(certificate);
    }
  };

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-xl overflow-hidden p-5 flex flex-col h-full hover:shadow-lg hover:bg-slate-800/40 transition-all cursor-pointer group"
    >
      {/* Certificate Image/Badge */}
      {certificate.image ? (
        <div className="mb-3 h-24 w-full overflow-hidden rounded-lg bg-slate-900">
          <img
            src={certificate.image}
            alt={certificate.title}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mb-3 flex justify-center">
          <Award className="text-primary group-hover:scale-110 transition-transform" size={40} />
        </div>
      )}

      {/* Title */}
      <h3 className="font-semibold text-slate-100 line-clamp-2 text-sm md:text-base group-hover:text-primary transition-colors mb-2 flex-grow">
        {certificate.title}
      </h3>

      {/* Skill Badge */}
      <div className="mb-3">
        <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary group-hover:bg-primary/20 transition-colors">
          {certificate.skill}
        </span>
      </div>

      {/* Date if available */}
      {certificate.date && (
        <div className="mb-2 flex items-center gap-1 text-xs text-slate-400">
          <Calendar size={12} />
          <span>{new Date(certificate.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</span>
        </div>
      )}

      {/* Visible badge */}
      {certificate.visible === false && (
        <div className="mb-3 text-xs text-slate-500 font-medium">👁️ Hidden</div>
      )}

      {/* External Link Icon */}
      <div className="flex justify-end pt-2 border-t border-white/5">
        <ExternalLink
          className="text-primary/60 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all mt-2"
          size={16}
        />
      </div>
    </motion.div>
  );

  // If modal is enabled, wrap in button, otherwise wrap in anchor
  if (onModal) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="text-left w-full"
        aria-label={`View ${certificate.title} details`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <a
      href={certificate.certificate_link || certificate.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={`Open ${certificate.title}`}
    >
      {cardContent}
    </a>
  );
};
