import { useEffect, useState } from "react";
import { getTheme, updateTheme } from "../api/adminApi";

export const ThemePage = () => {
  const [form, setForm] = useState({
    primaryColor: "#22c55e",
    accentColor: "#38bdf8",
    backgroundColor: "#020617",
    mode: "dark",
    font: "Space Grotesk"
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await getTheme();
      setForm({
        primaryColor: data.primaryColor || "#22c55e",
        accentColor: data.accentColor || "#38bdf8",
        backgroundColor: data.backgroundColor || "#020617",
        mode: data.mode || "dark",
        font: data.font || "Space Grotesk"
      });
    };
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await updateTheme(form);
    setMessage("Theme settings updated.");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Theme Settings</h2>
      <form onSubmit={submit} className="grid gap-4 rounded-xl border border-white/10 bg-slate-950 p-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Primary Color</span>
          <input
            type="color"
            value={form.primaryColor}
            onChange={(event) => setForm((prev) => ({ ...prev, primaryColor: event.target.value }))}
            className="h-10 w-full rounded-lg border border-white/10 bg-transparent"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Accent Color</span>
          <input
            type="color"
            value={form.accentColor}
            onChange={(event) => setForm((prev) => ({ ...prev, accentColor: event.target.value }))}
            className="h-10 w-full rounded-lg border border-white/10 bg-transparent"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Background Color</span>
          <input
            type="color"
            value={form.backgroundColor}
            onChange={(event) => setForm((prev) => ({ ...prev, backgroundColor: event.target.value }))}
            className="h-10 w-full rounded-lg border border-white/10 bg-transparent"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Mode</span>
          <select
            value={form.mode}
            onChange={(event) => setForm((prev) => ({ ...prev, mode: event.target.value }))}
            className="h-10 w-full rounded-lg border border-white/15 bg-slate-900 px-3"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-slate-300">Font Family</span>
          <input
            value={form.font}
            onChange={(event) => setForm((prev) => ({ ...prev, font: event.target.value }))}
            className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-2"
            placeholder="Space Grotesk"
          />
        </label>
        <button type="submit" className="w-fit rounded-lg bg-primary px-4 py-2 font-semibold text-slate-950">
          Save Theme
        </button>
      </form>
      {message && <p className="text-green-300">{message}</p>}
    </div>
  );
};

