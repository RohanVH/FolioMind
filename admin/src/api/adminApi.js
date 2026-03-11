import { api } from "./http";

export const loginRequest = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const getOverviewData = async () => {
  const [projects, skills, site, theme] = await Promise.all([
    api.get("/projects"),
    api.get("/skills"),
    api.get("/site"),
    api.get("/theme")
  ]);
  return {
    projects: projects.data,
    skills: skills.data,
    site: site.data,
    theme: theme.data
  };
};

export const getProjects = async () => (await api.get("/projects")).data;
export const createProject = async (payload) => (await api.post("/projects", payload)).data;
export const updateProject = async (id, payload) => (await api.put(`/projects/${id}`, payload)).data;
export const deleteProject = async (id) => (await api.delete(`/projects/${id}`)).data;

export const getSkills = async () => (await api.get("/skills")).data;
export const createSkill = async (payload) => (await api.post("/skills", payload)).data;
export const updateSkill = async (id, payload) => (await api.put(`/skills/${id}`, payload)).data;
export const deleteSkill = async (id) => (await api.delete(`/skills/${id}`)).data;

export const getSite = async () => (await api.get("/site")).data;
export const updateSite = async (payload) => (await api.put("/site", payload)).data;

export const getTheme = async () => (await api.get("/theme")).data;
export const updateTheme = async (payload) => (await api.put("/theme", payload)).data;

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await api.post("/upload/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const deleteResumeFile = async (publicId) => {
  const { data } = await api.delete("/upload/resume", {
    data: { publicId }
  });
  return data;
};
