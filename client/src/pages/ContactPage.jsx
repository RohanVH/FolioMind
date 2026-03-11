import { Github, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { PageContainer } from "../components/layout/PageContainer";

export const ContactPage = ({ site }) => (
  <PageContainer title="Contact" subtitle="Reach out for collaborations and opportunities.">
    <div className="grid gap-4 md:grid-cols-2">
      <motion.a
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        href={`mailto:${site?.contactEmail || ""}`}
        className="glass-card rounded-2xl p-5 text-center hover:border-primary/60"
      >
        <Mail className="mx-auto mb-3 text-primary" />
        <p>{site?.contactEmail || "No email configured"}</p>
      </motion.a>
      <motion.a
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        href={site?.github || "#"}
        target="_blank"
        rel="noreferrer"
        className="glass-card rounded-2xl p-5 text-center hover:border-primary/60"
      >
        <Github className="mx-auto mb-3 text-primary" />
        <p>GitHub</p>
      </motion.a>
    </div>
  </PageContainer>
);
