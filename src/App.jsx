import { Routes, Route, useLocation } from "react-router-dom";
import { FloatingChatbot } from "./components/chat/FloatingChatbot";
import { AmbientBackdrop } from "./components/layout/AmbientBackdrop";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { usePortfolioData } from "./hooks/usePortfolioData";
import AdminApp from "./admin/App";
import { AuthProvider } from "./admin/context/AuthContext";
import { AboutPage } from "./pages/AboutPage";
import { AssistantPage } from "./pages/AssistantPage";
import { CertificatesPage } from "./pages/CertificatesPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SkillsPage } from "./pages/SkillsPage";

const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center text-slate-300">Loading portfolio...</div>
);

const ErrorState = ({ message }) => (
  <div className="flex min-h-screen items-center justify-center text-red-300">{message}</div>
);

const PublicApp = () => {
  const { site, skills, projects, certificates, loading, error } = usePortfolioData();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <div className="min-h-screen bg-theme text-slate-100">
      <AmbientBackdrop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage site={site} featuredProjects={featuredProjects} />} />
        <Route path="/about" element={<AboutPage site={site} />} />
        <Route path="/skills" element={<SkillsPage skills={skills} />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/projects" element={<ProjectsPage projects={projects} />} />
        <Route path="/contact" element={<ContactPage site={site} />} />
        <Route path="/assistant" element={<AssistantPage />} />
      </Routes>
      <Footer />
      <FloatingChatbot site={site} skills={skills} projects={projects} />
    </div>
  );
};

const App = () => {
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
    return (
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    );
  }

  return <PublicApp />;
};

export default App;
