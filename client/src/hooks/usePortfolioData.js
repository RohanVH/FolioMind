import { useEffect, useState } from "react";
import { fetchProjects, fetchSiteContent, fetchSkills, fetchHackerRankProfile, fetchCertificates } from "../api/portfolioApi";

export const usePortfolioData = () => {
  const [state, setState] = useState({
    site: null,
    skills: [],
    projects: [],
    certificates: [],
    loading: true,
    error: ""
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [site, skills, projects, hackerRankData, dbCertificates] = await Promise.all([
          fetchSiteContent(),
          fetchSkills(),
          fetchProjects(),
          fetchHackerRankProfile().catch(() => ({ certificates: [] })),
          fetchCertificates().catch(() => [])
        ]);
        // Merge both HackerRank and database certificates
        const allCertificates = [
          ...(hackerRankData?.certificates || []),
          ...dbCertificates
        ];
        setState({
          site,
          skills,
          projects,
          certificates: allCertificates,
          loading: false,
          error: ""
        });
      } catch (error) {
        setState({
          site: null,
          skills: [],
          projects: [],
          certificates: [],
          loading: false,
          error: "Failed to load portfolio data."
        });
      }
    };
    load();
  }, []);

  return state;
};

