import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export const CertificateForm = ({ certificate, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    title: certificate?.title || "",
    skill: certificate?.skill || "",
    certificate_link: certificate?.certificate_link || "",
    image: certificate?.image || "",
    date: certificate?.date ? new Date(certificate.date).toISOString().split("T")[0] : ""
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    
    if (!form.skill.trim()) {
      newErrors.skill = "Skill is required";
    } else if (form.skill.trim().length < 2) {
      newErrors.skill = "Skill must be at least 2 characters";
    }
    
    if (!form.certificate_link.trim()) {
      newErrors.certificate_link = "Certificate link is required";
    } else if (!form.certificate_link.trim().startsWith("http")) {
      newErrors.certificate_link = "Must be a valid URL (start with http/https)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      ...form,
      date: form.date ? new Date(form.date) : null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onSubmit={handleSubmit}
      className="space-y-4 bg-slate-900/50 border border-white/10 rounded-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {certificate ? "Edit Certificate" : "Add Certificate"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Title *</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleInputChange}
          placeholder="e.g., Problem Solving (Intermediate)"
          className={`w-full rounded-lg border px-3 py-2 bg-slate-800 text-slate-100 placeholder-slate-500 outline-none transition ${
            errors.title ? "border-red-500" : "border-white/10 focus:border-primary"
          }`}
        />
        {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
      </div>

      {/* Skill */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Skill/Domain *</label>
        <input
          type="text"
          name="skill"
          value={form.skill}
          onChange={handleInputChange}
          placeholder="e.g., Problem Solving, Python, JavaScript"
          className={`w-full rounded-lg border px-3 py-2 bg-slate-800 text-slate-100 placeholder-slate-500 outline-none transition ${
            errors.skill ? "border-red-500" : "border-white/10 focus:border-primary"
          }`}
        />
        {errors.skill && <p className="mt-1 text-xs text-red-400">{errors.skill}</p>}
      </div>

      {/* Certificate Link */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Certificate Link *</label>
        <input
          type="url"
          name="certificate_link"
          value={form.certificate_link}
          onChange={handleInputChange}
          placeholder="https://example.com/certificate"
          className={`w-full rounded-lg border px-3 py-2 bg-slate-800 text-slate-100 placeholder-slate-500 outline-none transition ${
            errors.certificate_link ? "border-red-500" : "border-white/10 focus:border-primary"
          }`}
        />
        {errors.certificate_link && (
          <p className="mt-1 text-xs text-red-400">{errors.certificate_link}</p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Image URL (Optional)</label>
        <input
          type="url"
          name="image"
          value={form.image}
          onChange={handleInputChange}
          placeholder="https://example.com/certificate-badge.png"
          className="w-full rounded-lg border border-white/10 px-3 py-2 bg-slate-800 text-slate-100 placeholder-slate-500 outline-none focus:border-primary transition"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Date (Optional)</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleInputChange}
          className="w-full rounded-lg border border-white/10 px-3 py-2 bg-slate-800 text-slate-100 outline-none focus:border-primary transition"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 mt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-white/20 px-4 py-2 font-medium text-slate-300 hover:bg-slate-800 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-slate-950 hover:bg-primary/90 transition disabled:opacity-70"
        >
          {loading ? "Saving..." : "Save Certificate"}
        </button>
      </div>
    </motion.form>
  );
};
