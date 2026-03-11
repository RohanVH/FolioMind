import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchHackerRankProfile, fetchProfileAggregate } from "../api/portfolioApi";
import { PageContainer } from "../components/layout/PageContainer";
import { Weight } from "lucide-react";

export const AboutPage = ({ site }) => {
  const [showResume, setShowResume] = useState(false);
  const resumePreviewUrl = site?.resumeLink
    ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(site.resumeLink)}`
    : "";
  const [profileData, setProfileData] = useState({
    githubProfile: null,
    githubRepositories: [],
    githubLoading: true,
    hackerRankProfile: "",
    hackerRankCertificates: [],
    hackerRankWarning: ""
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [githubData, hackerRankData] = await Promise.all([
          fetchProfileAggregate().catch(() => null),
          fetchHackerRankProfile().catch(() => null)
        ]);

        setProfileData({
          githubProfile: githubData?.githubProfile || null,
          githubRepositories: githubData?.githubRepositories || [],
          githubLoading: false,
          hackerRankProfile: hackerRankData?.profileUrl || githubData?.hackerRankProfile || site?.hackerrank || "",
          hackerRankCertificates: hackerRankData?.certificates || githubData?.hackerRankCertificates || [],
          hackerRankWarning: hackerRankData?.warning || githubData?.hackerRankWarning || ""
        });
      } catch {
        setProfileData((prev) => ({
          ...prev,
          githubLoading: false,
          hackerRankProfile: site?.hackerrank || ""
        }));
      }
    };
    load();
  }, []);

  return (
    <PageContainer title="About" subtitle="A quick overview of my background and focus.">
      <center>
        <h1 className="text-4xl font-extrabold tracking-wide md:text-6xl">ROHAN V</h1>
      </center>


      {(site?.aboutSections || []).length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="glass-card mt-6 rounded-3xl p-6"
        >
          {/* <h3 className="mb-4 text-lg font-semibold">About Sections</h3> */}
          <div className="space-y-4">
            {[...(site.aboutSections || [])]
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((section, index) => (
                <div key={`${section.title}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="mb-2 text-base font-semibold text-primary">{section.title}</p>
                  <p className="whitespace-pre-wrap text-sm text-slate-300">{section.content}</p>
                </div>
              ))}
          </div>
        </motion.section>
      )}
      <br />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-7"
      >
        <center> <p className="whitespace-pre-wrap text-lg leading-relaxed text-slate-100">{site?.aboutText}</p>
          {site?.resumeLink && (
            <button
              type="button"
              onClick={() => setShowResume((prev) => !prev)}
              className="mt-5 rounded-lg border border-white/20 px-10 py-2 text-sm font-medium"
            >
              {showResume ? "Hide Resume" : "Show Resume"}
            </button>
          )}
        </center>
      </motion.div>
      <AnimatePresence>
        {site?.resumeLink && showResume && (
          <motion.section
            initial={{ opacity: 0, height: 0, y: 8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 8 }}
            transition={{ duration: 0.35 }}
            className="glass-card mt-6 overflow-hidden rounded-3xl p-5"
          >
            <h3 className="mb-3 text-lg font-semibold">Resume Preview</h3>
            <div className="rounded-xl border border-white/10 bg-black/20 p-2">
              <iframe src={resumePreviewUrl} title="Resume preview" className="h-[520px] w-full rounded-lg bg-white" />
              <a href={site.resumeLink} target="_blank" rel="noreferrer" className="inline-block p-3 text-accent">
                Open resume in new tab
              </a>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="glass-card mt-6 rounded-3xl p-6"
      >
        <h3 className="mb-4 text-lg font-semibold">GitHub Repository List</h3>
        {profileData.githubProfile && (
          <p className="mb-3 text-sm text-slate-300">
            {profileData.githubProfile.name || profileData.githubProfile.username} •{" "}
            {profileData.githubProfile.publicRepos} public repositories
          </p>
        )}
        <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {profileData.githubRepositories.map((repo) => (
            <a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-white/10 bg-black/20 p-3 transition hover:border-primary/50"
            >
              <p className="font-semibold text-slate-100">{repo.name}</p>
              {repo.description && <p className="mt-1 text-sm text-slate-300">{repo.description}</p>}
              <p className="mt-2 text-xs text-slate-400">
                {repo.language || "Unknown"} • ⭐ {repo.stars}
              </p>
            </a>
          ))}
          {!profileData.githubLoading && profileData.githubRepositories.length === 0 && (
            <p className="text-sm text-slate-300">No repositories found.</p>
          )}
        </div>
      </motion.section>

      {/* <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="glass-card mt-6 rounded-3xl p-6"
      >
        <h3 className="mb-4 text-lg font-semibold">HackerRank Certifications</h3>
        {profileData.hackerRankCertificates.length > 0 ? (
          <div className="space-y-2">
            {profileData.hackerRankCertificates.map((certificate, index) => (
              <p key={`${certificate}-${index}`} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
                {certificate}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-300">No certifications found.</p>
        )}
        {profileData.hackerRankWarning && <p className="mt-3 text-xs text-amber-300">{profileData.hackerRankWarning}</p>}
        {(profileData.hackerRankProfile || site?.hackerrank) && (
          <a
            href={profileData.hackerRankProfile || site?.hackerrank}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm text-accent"
          >
            Open HackerRank Profile →
          </a>
        )}
      </motion.section> */}
    </PageContainer>
  );
};
