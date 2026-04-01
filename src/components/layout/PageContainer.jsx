import { motion } from "framer-motion";

export const PageContainer = ({ title, subtitle, children }) => (
  <main className="mx-auto w-full max-w-6xl px-4 py-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-10"
    >
      {/* <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary/80">FolioMind</p> */}
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-3xl text-slate-300/90">{subtitle}</p>}
    </motion.div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
      {children}
    </motion.div>
  </main>
);
