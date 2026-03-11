import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { AboutContentPage } from "./pages/AboutContentPage";
import { MediaPage } from "./pages/MediaPage";
import { OverviewPage } from "./pages/OverviewPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SiteContentPage } from "./pages/SiteContentPage";
import { SkillsPage } from "./pages/SkillsPage";
import { ThemePage } from "./pages/ThemePage";

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<OverviewPage />} />
      <Route path="about-content" element={<AboutContentPage />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="skills" element={<SkillsPage />} />
      <Route path="site-content" element={<SiteContentPage />} />
      <Route path="theme" element={<ThemePage />} />
      <Route path="media" element={<MediaPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
    <Route path="/admin/*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
