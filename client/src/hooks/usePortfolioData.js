import { useEffect, useState } from "react";
import { fetchProjects, fetchSiteContent, fetchSkills } from "../api/portfolioApi";

export const usePortfolioData = () => {
  const [state, setState] = useState({
    site: null,
    skills: [],
    projects: [],
    loading: true,
    error: ""
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [site, skills, projects] = await Promise.all([
          fetchSiteContent(),
          fetchSkills(),
          fetchProjects()
        ]);
        setState({ site, skills, projects, loading: false, error: "" });
      } catch (error) {
        setState({
          site: null,
          skills: [],
          projects: [],
          loading: false,
          error: "Failed to load portfolio data."
        });
      }
    };
    load();
  }, []);

  return state;
};

