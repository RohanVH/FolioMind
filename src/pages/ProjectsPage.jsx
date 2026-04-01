import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import { PageContainer } from "../components/layout/PageContainer";

export const ProjectsPage = ({ projects = [] }) => (
  <PageContainer title="Projects" subtitle="Selected work with source code and live demos.">
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project, index) => (
        <motion.article
          key={project._id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          className="glass-card overflow-hidden rounded-2xl"
        >
          {project.image && (
            <img src={project.image} alt={project.title} className="h-44 w-full object-cover" loading="lazy" />
          )}
          <div className="space-y-3 p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              {project.featured && <span className="rounded-full bg-primary/20 px-2 py-1 text-xs">Featured</span>}
            </div>
            <p className="text-sm text-slate-300">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {(project.techStack || []).map((tech) => (
                <span key={tech} className="rounded-full border border-white/20 bg-black/20 px-2 py-1 text-xs">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-4 pt-1 text-sm">
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent">
                  <Github size={14} /> GitHub
                </a>
              )}
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent">
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
    {projects.length === 0 && <p className="text-slate-400">No projects added yet.</p>}
  </PageContainer>
);
