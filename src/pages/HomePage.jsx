import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";

export const HomePage = ({ site, featuredProjects = [] }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const heroImages = useMemo(
    () =>
      [...(site?.heroImages || [])].sort(
        (a, b) => (a?.order ?? 0) - (b?.order ?? 0)
      ),
    [site?.heroImages]
  );

  useEffect(() => {
    if (heroImages.length <= 1) {
      return undefined;
    }
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [heroImages]);

  useEffect(() => {
    if (activeSlide >= heroImages.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, heroImages.length]);

  return (
    <PageContainer title={site?.heroTitle || "Developer Portfolio"} subtitle={site?.heroSubtitle || ""}>
      {heroImages.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-7 overflow-hidden rounded-3xl p-3"
        >
          <div className="relative h-[260px] overflow-hidden rounded-2xl md:h-[340px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={heroImages[activeSlide]?.url}
                src={heroImages[activeSlide]?.url}
                alt={`Hero slide ${activeSlide + 1}`}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/35 px-3 py-1.5">
              {heroImages.map((item, index) => (
                <button
                  key={`${item.url}-${index}`}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    activeSlide === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.section>
      )}

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-card neon-ring space-y-7 rounded-3xl p-7"
      >
        <p className="max-w-2xl text-xl leading-relaxed text-slate-100">{site?.heroIntro}</p>
        <div className="grid grid-cols-2 gap-3 text-sm md:max-w-lg">
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-slate-400">Role</p>
            <p className="font-semibold">Full Stack Engineer</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-slate-400">Focus</p>
            <p className="font-semibold">AI Products</p>
          </div>
        </div>
        {site?.resumeLink && (
          <a
            href={site.resumeLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-slate-950 transition hover:scale-[1.03]"
          >
            <Download size={16} />
            Download Resume
          </a>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-card rounded-3xl p-6"
      >
        <h3 className="mb-4 text-xl font-semibold">Featured Projects</h3>
        <div className="space-y-4">
          {featuredProjects.slice(0, 3).map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="rounded-xl border border-white/10 bg-black/20 p-4"
            >
              <p className="font-semibold">{project.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-300">{project.description}</p>
            </motion.div>
          ))}
          {featuredProjects.length === 0 && <p className="text-sm text-slate-400">No featured projects yet.</p>}
        </div>
        <Link to="/projects" className="mt-5 inline-block text-sm font-medium text-accent">
          View all projects →
        </Link>
      </motion.div>
      </section>
    </PageContainer>
  );
};
