import { useEffect, useState } from "react";
import { fetchCertificates } from "../api/portfolioApi";
import { mockCertificates } from "../data/mockCertificates";

export const useCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("all");

  useEffect(() => {
    const getCertificates = async () => {
      try {
        setLoading(true);
        const data = await fetchCertificates();

        // Use fetched data if available, otherwise fallback to mock
        const certificatesToUse = Array.isArray(data) && data.length > 0 ? data : mockCertificates;
        setCertificates(certificatesToUse);
        setFilteredCertificates(certificatesToUse);
        setError("");
      } catch (err) {
        // Fallback to mock data on error
        setCertificates(mockCertificates);
        setFilteredCertificates(mockCertificates);
        setError("Using demo certificates. Real data will appear when connected.");
      } finally {
        setLoading(false);
      }
    };

    getCertificates();
  }, []);

  // Filter certificates by skill
  useEffect(() => {
    if (selectedSkill === "all") {
      setFilteredCertificates(certificates);
    } else {
      setFilteredCertificates(
        certificates.filter((cert) => cert.skill === selectedSkill)
      );
    }
  }, [selectedSkill, certificates]);

  // Get unique skills for filter dropdown
  const skills = ["all", ...new Set(certificates.map((cert) => cert.skill))];

  return {
    certificates,
    filteredCertificates,
    loading,
    error,
    skills,
    selectedSkill,
    setSelectedSkill,
    totalCertificates: certificates.length,
    filteredCount: filteredCertificates.length
  };
};
