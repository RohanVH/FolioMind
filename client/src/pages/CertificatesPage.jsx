import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { CertificateGrid } from "../components/certificates/CertificateGrid";
import { CertificateSkeleton } from "../components/certificates/CertificateSkeleton";
import { CertificateModal } from "../components/certificates/CertificateModal";
import { useCertificates } from "../hooks/useCertificates";

export const CertificatesPage = () => {
  const { filteredCertificates, loading, skills, selectedSkill, setSelectedSkill, totalCertificates, filteredCount } = useCertificates();
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCertificate(null), 300);
  };

  return (
    <PageContainer
      title="Certificates"
      subtitle={`Professional certifications and achievements. ${totalCertificates > 0 ? `${totalCertificates} total certificates` : ""}`}
    >
      {/* Filter Section */}
      {!loading && skills.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center gap-3"
        >
          <div className="flex items-center gap-2 text-slate-400">
            <Filter size={18} />
            <span className="text-sm font-medium">Filter by skill:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <motion.button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedSkill === skill
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "bg-slate-800/50 text-slate-300 border border-white/10 hover:border-white/20 hover:bg-slate-800"
                }`}
              >
                <span className="capitalize">
                  {skill === "all" ? "All Skills" : skill}
                </span>
                {selectedSkill === skill && skill !== "all" && (
                  <X className="ml-2 inline-block" size={14} />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results Counter */}
      {!loading && filteredCount > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-sm text-slate-400"
        >
          Showing {filteredCount} of {totalCertificates} certificate{totalCertificates !== 1 ? "s" : ""}
        </motion.p>
      )}

      {/* Loading State */}
      {loading && <CertificateSkeleton count={8} />}

      {/* Content */}
      {!loading && (
        <CertificateGrid
          certificates={filteredCertificates}
          onCardClick={handleCardClick}
          isEmpty={filteredCertificates.length === 0}
        />
      )}

      {/* Empty State */}
      {!loading && filteredCertificates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-slate-900/30 border border-white/5 p-12 text-center"
        >
          <h3 className="mb-2 text-lg font-semibold text-slate-300">
            {selectedSkill !== "all" ? "No certificates found in this skill" : "No certificates found"}
          </h3>
          <p className="text-slate-400">
            {selectedSkill !== "all"
              ? "Try selecting a different skill or view all certificates."
              : "Check back soon for new certifications!"}
          </p>
          {selectedSkill !== "all" && (
            <button
              onClick={() => setSelectedSkill("all")}
              className="mt-4 rounded-lg bg-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/30 transition-colors"
            >
              View All Certificates
            </button>
          )}
        </motion.div>
      )}

      {/* Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </PageContainer>
  );
};
