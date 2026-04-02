import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";

const HeroScene = lazy(() => import("../components/three/HeroScene").then((module) => ({ default: module.HeroScene })));

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
      <section className="hero-panel mb-8 grid gap-8 overflow-hidden rounded-[2rem] p-5 md:p-8 xl:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col justify-between gap-8"
        >
          <div className="space-y-5">
            <span className="hero-kicker">
              <Sparkles size={14} />
              AI-native full stack portfolio
            </span>
            <div className="space-y-4">
              <h2 className="hero-headline">
                Building vivid digital products with backend depth and cinematic frontend polish.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                {site?.heroIntro ||
                  "I design modern product experiences, intelligent interfaces, and resilient systems that feel sharp in motion and stable in production."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="hero-stat-card">
                <p className="hero-stat-label">Focus</p>
                <p className="hero-stat-value">Immersive product UX</p>
              </div>
              <div className="hero-stat-card">
                <p className="hero-stat-label">Stack</p>
                <p className="hero-stat-value">React, Node.js, AI</p>
              </div>
              <div className="hero-stat-card">
                <p className="hero-stat-label">Approach</p>
                <p className="hero-stat-value">Fast, polished, reliable</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.03]"
            >
              Explore Projects
              <ArrowRight size={16} />
            </Link>
            {site?.resumeLink && (
              <a
                href={site.resumeLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-slate-100 transition hover:border-white/30 hover:bg-white/10"
              >
                <Download size={16} />
                Download Resume
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="relative min-h-[360px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20"
        >
          <Suspense fallback={<div className="hero-scene-shell" />}>
            <HeroScene />
          </Suspense>
          <div className="hero-panel-badge">
            <span className="hero-panel-badge-dot" />
            Real-time interactive 3D scene
          </div>
        </motion.div>
      </section>

      {heroImages.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-7 overflow-hidden rounded-3xl p-3 shadow-[0_30px_100px_rgba(15,23,42,0.28)]"
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

      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-card neon-ring relative overflow-hidden space-y-7 rounded-3xl p-7"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <p className="max-w-2xl text-xl leading-relaxed text-slate-100">{site?.heroIntro}</p>
        <div className="grid grid-cols-2 gap-3 text-sm md:max-w-lg">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-slate-400">Role</p>
            <p className="font-semibold">Full Stack Engineer</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
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
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Featured Projects</h3>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">
            Selected
          </span>
        </div>
        <div className="space-y-4">
          {featuredProjects.slice(0, 3).map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              <p className="font-semibold">{project.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-300">{project.description}</p>
            </motion.div>
          ))}
          {featuredProjects.length === 0 && <p className="text-sm text-slate-400">No featured projects yet.</p>}
        </div>
        <Link to="/projects" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
          View all projects
          <ArrowRight size={15} />
        </Link>
      </motion.div>
      </section>
    </PageContainer>
  );
};
