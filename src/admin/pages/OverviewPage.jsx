import { useEffect, useState } from "react";
import { getOverviewData } from "../api/adminApi";

export const OverviewPage = () => {
  const [state, setState] = useState({
    projects: [],
    skills: [],
    site: null,
    loading: true
  });

  useEffect(() => {
    const load = async () => {
      const data = await getOverviewData();
      setState({ ...data, loading: false });
    };
    load();
  }, []);

  if (state.loading) {
    return <p>Loading overview...</p>;
  }

  const featuredCount = state.projects.filter((project) => project.featured).length;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Overview</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Total Projects</p>
          <p className="text-2xl font-bold">{state.projects.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Featured Projects</p>
          <p className="text-2xl font-bold">{featuredCount}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Total Skills</p>
          <p className="text-2xl font-bold">{state.skills.length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
        <p className="text-sm text-slate-400">Hero Title</p>
        <p className="text-lg">{state.site?.heroTitle}</p>
      </div>
    </div>
  );
};

