import { useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  uploadImage
} from "../api/adminApi";

const defaultForm = {
  title: "",
  description: "",
  techStack: "",
  githubLink: "",
  liveLink: "",
  image: "",
  featured: false,
  order: 0
};

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      techStack: form.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      order: Number(form.order) || 0
    };
    try {
      if (editingId) {
        await updateProject(editingId, payload);
      } else {
        await createProject(payload);
      }
      setForm(defaultForm);
      setEditingId("");
      await load();
    } finally {
      setLoading(false);
    }
  };

  const edit = (project) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      techStack: (project.techStack || []).join(", "),
      githubLink: project.githubLink || "",
      liveLink: project.liveLink || "",
      image: project.image || "",
      featured: Boolean(project.featured),
      order: project.order || 0
    });
  };

  const remove = async (id) => {
    await deleteProject(id);
    await load();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const result = await uploadImage(file);
    setForm((prev) => ({ ...prev, image: result.url }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Projects Management</h2>
      <form onSubmit={submit} className="grid gap-3 rounded-xl border border-white/10 bg-slate-950 p-4">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          className="min-h-24 rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
        <input
          placeholder="Tech stack (comma separated)"
          value={form.techStack}
          onChange={(event) => setForm((prev) => ({ ...prev, techStack: event.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            placeholder="GitHub link"
            value={form.githubLink}
            onChange={(event) => setForm((prev) => ({ ...prev, githubLink: event.target.value }))}
            className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
          />
          <input
            placeholder="Live demo link"
            value={form.liveLink}
            onChange={(event) => setForm((prev) => ({ ...prev, liveLink: event.target.value }))}
            className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
          />
        </div>
        <p className="text-xs text-slate-400">
          Tip: Paste only GitHub link and submit. Title, tech stack, image, and AI description will auto-generate.
        </p>
        <div className="grid gap-3 md:grid-cols-[1fr_130px_140px]">
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
            className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="rounded-lg border border-white/15 p-2 text-xs" />
          <input
            type="number"
            placeholder="Order"
            value={form.order}
            onChange={(event) => setForm((prev) => ({ ...prev, order: event.target.value }))}
            className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))}
          />
          Featured project
        </label>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-2 font-medium text-slate-950">
            {editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && (
            <button
              type="button"
              className="rounded-lg border border-white/15 px-4 py-2"
              onClick={() => {
                setEditingId("");
                setForm(defaultForm);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project._id} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-950 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold">{project.title}</p>
              <p className="text-sm text-slate-400">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => edit(project)} className="rounded-lg border border-white/15 px-3 py-1 text-sm">
                Edit
              </button>
              <button type="button" onClick={() => remove(project._id)} className="rounded-lg border border-red-400/50 px-3 py-1 text-sm text-red-200">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
