import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { AboutContentPage } from "./pages/AboutContentPage";
import { CertificatesManagementPage } from "./pages/CertificatesManagementPage";
import { MediaPage } from "./pages/MediaPage";
import { OverviewPage } from "./pages/OverviewPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SiteContentPage } from "./pages/SiteContentPage";
import { SkillsPage } from "./pages/SkillsPage";
import { ThemePage } from "./pages/ThemePage";

const App = () => (
  <Routes>
    <Route path="/admin/login" element={<LoginPage />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<OverviewPage />} />
      <Route path="about-content" element={<AboutContentPage />} />
      <Route path="certificates" element={<CertificatesManagementPage />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="skills" element={<SkillsPage />} />
      <Route path="site-content" element={<SiteContentPage />} />
      <Route path="theme" element={<ThemePage />} />
      <Route path="media" element={<MediaPage />} />
    </Route>
    <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
  </Routes>
);

export default App;
