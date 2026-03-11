import { useEffect, useState } from "react";
import { deleteResumeFile, getSite, updateSite, uploadResume } from "../api/adminApi";

export const AboutContentPage = () => {
  const [form, setForm] = useState({
    aboutText: "",
    aboutSections: [],
    resumeLink: "",
    resumePublicId: "",
    github: "",
    hackerrank: ""
  });
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await getSite();
      setForm({
        aboutText: data.aboutText || "",
        aboutSections: Array.isArray(data.aboutSections) ? data.aboutSections : [],
        resumeLink: data.resumeLink || "",
        resumePublicId: data.resumePublicId || "",
        github: data.github || "",
        hackerrank: data.hackerrank || ""
      });
    };
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    await updateSite(form);
    setMessage("About content updated.");
    setSaving(false);
  };

  const addAboutSection = () => {
    setForm((prev) => ({
      ...prev,
      aboutSections: [...(prev.aboutSections || []), { title: "", content: "", order: (prev.aboutSections || []).length }]
    }));
  };

  const updateAboutSectionField = (index, field, value) => {
    setForm((prev) => {
      const sections = [...(prev.aboutSections || [])];
      sections[index] = { ...sections[index], [field]: value };
      return { ...prev, aboutSections: sections };
    });
  };

  const moveAboutSection = (index, direction) => {
    setForm((prev) => {
      const sections = [...(prev.aboutSections || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sections.length) {
        return prev;
      }
      const [moved] = sections.splice(index, 1);
      sections.splice(targetIndex, 0, moved);
      return { ...prev, aboutSections: sections.map((section, order) => ({ ...section, order })) };
    });
  };

  const removeAboutSection = (index) => {
    setForm((prev) => {
      const sections = [...(prev.aboutSections || [])];
      sections.splice(index, 1);
      return { ...prev, aboutSections: sections.map((section, order) => ({ ...section, order })) };
    });
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    setMessage("");
    try {
      const result = await uploadResume(file);
      setForm((prev) => ({ ...prev, resumeLink: result.url, resumePublicId: result.publicId || "" }));
      setMessage("Resume uploaded. Click Save Changes to publish.");
    } finally {
      setUploadingResume(false);
      event.target.value = "";
    }
  };

  const handleResumeDelete = async () => {
    setMessage("");
    if (form.resumePublicId) {
      await deleteResumeFile(form.resumePublicId);
    }
    const payload = { ...form, resumeLink: "", resumePublicId: "" };
    setForm(payload);
    await updateSite(payload);
    setMessage("Resume removed.");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">About Content</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-white/10 bg-slate-950 p-4">
        <textarea
          placeholder="About text"
          value={form.aboutText}
          onChange={(event) => setForm((prev) => ({ ...prev, aboutText: event.target.value }))}
          className="min-h-28 rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />

        <div className="rounded-lg border border-white/15 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-slate-300">About Sections (Add / Arrange / Update)</p>
            <button type="button" onClick={addAboutSection} className="rounded-lg border border-white/20 px-3 py-1 text-xs">
              Add Section
            </button>
          </div>
          <div className="space-y-3">
            {(form.aboutSections || []).map((section, index) => (
              <div key={`about-section-${index}`} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-2 flex gap-2">
                  <button type="button" onClick={() => moveAboutSection(index, "up")} className="rounded border border-white/20 px-2 py-1 text-xs">
                    Up
                  </button>
                  <button type="button" onClick={() => moveAboutSection(index, "down")} className="rounded border border-white/20 px-2 py-1 text-xs">
                    Down
                  </button>
                  <button type="button" onClick={() => removeAboutSection(index)} className="rounded border border-red-400/50 px-2 py-1 text-xs text-red-200">
                    Delete
                  </button>
                </div>
                <input
                  placeholder="Section title"
                  value={section.title || ""}
                  onChange={(event) => updateAboutSectionField(index, "title", event.target.value)}
                  className="mb-2 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2"
                />
                <textarea
                  placeholder="Section content"
                  value={section.content || ""}
                  onChange={(event) => updateAboutSectionField(index, "content", event.target.value)}
                  className="min-h-24 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2"
                />
              </div>
            ))}
            {(form.aboutSections || []).length === 0 && <p className="text-xs text-slate-400">No custom about sections yet.</p>}
          </div>
        </div>

        <div className="rounded-lg border border-white/15 p-3">
          <p className="mb-2 text-sm text-slate-300">Resume Upload (PDF)</p>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <input type="file" accept=".pdf" onChange={handleResumeUpload} className="text-sm" />
            <input value={form.resumeLink} readOnly placeholder="Uploaded resume URL" className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
            <button
              type="button"
              onClick={handleResumeDelete}
              disabled={!form.resumeLink}
              className="rounded-lg border border-red-400/50 px-3 py-2 text-sm text-red-200 disabled:opacity-50"
            >
              Delete Resume
            </button>
          </div>
          {uploadingResume && <p className="mt-2 text-xs text-slate-400">Uploading resume...</p>}
        </div>

        <input
          placeholder="GitHub link"
          value={form.github}
          onChange={(event) => setForm((prev) => ({ ...prev, github: event.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
        <input
          placeholder="HackerRank profile link"
          value={form.hackerrank}
          onChange={(event) => setForm((prev) => ({ ...prev, hackerrank: event.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />

        <button type="submit" disabled={saving} className="w-fit rounded-lg bg-primary px-4 py-2 font-semibold text-slate-950">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
      {message && <p className="text-green-300">{message}</p>}
    </div>
  );
};
