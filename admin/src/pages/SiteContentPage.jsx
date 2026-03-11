import { useEffect, useState } from "react";
import { deleteResumeFile, getSite, updateSite, uploadImage, uploadResume } from "../api/adminApi";

export const SiteContentPage = () => {
  const [form, setForm] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroIntro: "",
    aboutText: "",
    aboutSections: [],
    heroImages: [],
    resumeLink: "",
    resumePublicId: "",
    contactEmail: "",
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
        heroTitle: data.heroTitle || "",
        heroSubtitle: data.heroSubtitle || "",
        heroIntro: data.heroIntro || "",
        aboutText: data.aboutText || "",
        aboutSections: Array.isArray(data.aboutSections) ? data.aboutSections : [],
        heroImages: Array.isArray(data.heroImages) ? data.heroImages : [],
        resumeLink: data.resumeLink || "",
        resumePublicId: data.resumePublicId || "",
        contactEmail: data.contactEmail || "",
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
    setMessage("Site content updated.");
    setSaving(false);
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setUploadingResume(true);
    setMessage("");
    try {
      const result = await uploadResume(file);
      setForm((prev) => ({ ...prev, resumeLink: result.url, resumePublicId: result.publicId || "" }));
      setMessage("Resume uploaded. Click Save Changes to publish.");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleResumeDelete = async () => {
    setMessage("");
    if (form.resumePublicId) {
      await deleteResumeFile(form.resumePublicId);
    }
    const cleared = { ...form, resumeLink: "", resumePublicId: "" };
    setForm(cleared);
    await updateSite(cleared);
    setMessage("Resume removed.");
  };

  const handleCarouselImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setMessage("");
    try {
      const result = await uploadImage(file);
      setForm((prev) => ({
        ...prev,
        heroImages: [
          ...(prev.heroImages || []),
          {
            url: result.url,
            publicId: result.publicId || "",
            order: (prev.heroImages || []).length
          }
        ]
      }));
      setMessage("Carousel image added. Click Save Changes to publish.");
    } catch {
      setMessage("Failed to upload carousel image.");
    } finally {
      event.target.value = "";
    }
  };

  const moveCarouselImage = (index, direction) => {
    setForm((prev) => {
      const images = [...(prev.heroImages || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= images.length) {
        return prev;
      }
      const [moved] = images.splice(index, 1);
      images.splice(targetIndex, 0, moved);
      return {
        ...prev,
        heroImages: images.map((item, order) => ({ ...item, order }))
      };
    });
  };

  const removeCarouselImage = (index) => {
    setForm((prev) => {
      const images = [...(prev.heroImages || [])];
      images.splice(index, 1);
      return {
        ...prev,
        heroImages: images.map((item, order) => ({ ...item, order }))
      };
    });
  };

  const addAboutSection = () => {
    setForm((prev) => ({
      ...prev,
      aboutSections: [
        ...(prev.aboutSections || []),
        { title: "", content: "", order: (prev.aboutSections || []).length }
      ]
    }));
  };

  const updateAboutSectionField = (index, field, value) => {
    setForm((prev) => {
      const sections = [...(prev.aboutSections || [])];
      sections[index] = { ...sections[index], [field]: value };
      return { ...prev, aboutSections: sections };
    });
  };

  const removeAboutSection = (index) => {
    setForm((prev) => {
      const sections = [...(prev.aboutSections || [])];
      sections.splice(index, 1);
      return {
        ...prev,
        aboutSections: sections.map((section, order) => ({ ...section, order }))
      };
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
      return {
        ...prev,
        aboutSections: sections.map((section, order) => ({ ...section, order }))
      };
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Site Content Management</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-white/10 bg-slate-950 p-4">
        <input
          placeholder="Hero title"
          value={form.heroTitle}
          onChange={(event) => setForm((prev) => ({ ...prev, heroTitle: event.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
        <input
          placeholder="Hero subtitle"
          value={form.heroSubtitle}
          onChange={(event) => setForm((prev) => ({ ...prev, heroSubtitle: event.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
        <textarea
          placeholder="Hero intro"
          value={form.heroIntro}
          onChange={(event) => setForm((prev) => ({ ...prev, heroIntro: event.target.value }))}
          className="min-h-24 rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
        <textarea
          placeholder="About text"
          value={form.aboutText}
          onChange={(event) => setForm((prev) => ({ ...prev, aboutText: event.target.value }))}
          className="min-h-28 rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
        <div className="rounded-lg border border-white/15 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-slate-300">Home Carousel Images</p>
            <input type="file" accept="image/*" onChange={handleCarouselImageUpload} className="text-xs" />
          </div>
          <div className="space-y-3">
            {(form.heroImages || []).map((image, index) => (
              <div key={`${image.url}-${index}`} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <img src={image.url} alt={`Carousel ${index + 1}`} className="mb-2 h-28 w-full rounded-lg object-cover" />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveCarouselImage(index, "up")}
                    className="rounded border border-white/20 px-2 py-1 text-xs"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCarouselImage(index, "down")}
                    className="rounded border border-white/20 px-2 py-1 text-xs"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCarouselImage(index)}
                    className="rounded border border-red-400/50 px-2 py-1 text-xs text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {(form.heroImages || []).length === 0 && (
              <p className="text-xs text-slate-400">No carousel images added yet.</p>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-white/15 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-slate-300">About Sections (Add / Arrange / Update)</p>
            <button
              type="button"
              onClick={addAboutSection}
              className="rounded-lg border border-white/20 px-3 py-1 text-xs"
            >
              Add Section
            </button>
          </div>
          <div className="space-y-3">
            {(form.aboutSections || []).map((section, index) => (
              <div key={`about-section-${index}`} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveAboutSection(index, "up")}
                    className="rounded border border-white/20 px-2 py-1 text-xs"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveAboutSection(index, "down")}
                    className="rounded border border-white/20 px-2 py-1 text-xs"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAboutSection(index)}
                    className="rounded border border-red-400/50 px-2 py-1 text-xs text-red-200"
                  >
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
            {(form.aboutSections || []).length === 0 && (
              <p className="text-xs text-slate-400">No custom about sections yet.</p>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-white/15 p-3">
          <p className="mb-2 text-sm text-slate-300">Resume Upload (PDF)</p>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <input type="file" accept=".pdf" onChange={handleResumeUpload} className="text-sm" />
            <input
              placeholder="Uploaded resume URL"
              value={form.resumeLink}
              readOnly
              className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm"
            />
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
          placeholder="Contact email"
          value={form.contactEmail}
          onChange={(event) => setForm((prev) => ({ ...prev, contactEmail: event.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
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
