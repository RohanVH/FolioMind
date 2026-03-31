import { CertificateCard } from "./CertificateCard";

export const CertificateGrid = ({ certificates = [], onCardClick = null, isEmpty = false }) => {
  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-96 text-center">
        <div>
          <p className="text-lg font-semibold text-slate-300 mb-2">No certificates found</p>
          <p className="text-sm text-slate-400">Try adjusting your filter or check back later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {certificates.map((certificate, index) => (
        <CertificateCard
          key={certificate._id || certificate.id || `cert-${index}`}
          certificate={certificate}
          onModal={onCardClick}
          index={index}
        />
      ))}
    </div>
  );
};
