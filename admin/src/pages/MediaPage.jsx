import { useState } from "react";
import { uploadImage } from "../api/adminApi";

export const MediaPage = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      return;
    }
    setLoading(true);
    try {
      const result = await uploadImage(file);
      setUrl(result.url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Media Manager</h2>
      <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
        <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className="ml-3 rounded-lg bg-primary px-4 py-2 font-medium text-slate-950 disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {url && (
        <div className="space-y-3 rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Uploaded URL</p>
          <input value={url} readOnly className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-2" />
          <img src={url} alt="Uploaded" className="max-h-64 rounded-lg border border-white/10" />
        </div>
      )}
    </div>
  );
};

