import { api } from "./http";

export const fetchSiteContent = async () => {
  const { data } = await api.get("/site");
  return data;
};

export const fetchSkills = async () => {
  const { data } = await api.get("/skills");
  return data;
};

export const fetchProjects = async () => {
  const { data } = await api.get("/projects");
  return data;
};

export const fetchCertificates = async () => {
  const { data } = await api.get("/certificates");
  return data;
};

export const fetchTheme = async () => {
  const { data } = await api.get("/theme");
  return data;
};

export const fetchProfileAggregate = async () => {
  const { data } = await api.get("/profile/aggregate");
  return data;
};

export const fetchHackerRankProfile = async () => {
  const { data } = await api.get("/hackerrank");
  return data;
};

export const askAiAssistant = async (payload) => {
  const { data } = await api.post("/ai/chat", payload);
  return data;
};
