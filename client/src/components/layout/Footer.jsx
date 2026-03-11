export const Footer = () => (
  <footer className="mt-20 border-t border-white/10">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
      <p>© {new Date().getFullYear()} FolioMind</p>
      <p>Build once, update forever.</p>
    </div>
  </footer>
);
