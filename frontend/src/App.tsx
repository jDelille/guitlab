import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import AuthModal from "./components/auth/AuthModal";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationsProvider } from "./context/NotificationContext";
import { SettingsProvider } from "./context/SettingsContext";
import { PlaybackProvider } from "./context/PlaybackContext";

const Training = lazy(() => import("./pages/Training"));
const Drill = lazy(() => import("./pages/Drill"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const HowToGuide = lazy(() => import("./pages/HowToGuide"));
const Settings = lazy(() => import("./pages/Settings"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

function App() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  return (
    <ThemeProvider>
    <NotificationsProvider>
    <SettingsProvider>
    <PlaybackProvider>
    <BrowserRouter>
      <div className="page">
        <div className="layout">
          <Navbar onAuthOpen={(mode) => setAuthMode(mode)} />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/training" element={<Training />} />
              <Route path="/drill/:drillId" element={<Drill />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/how-to-guide" element={<HowToGuide />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
        {authMode && <AuthModal onClose={() => setAuthMode(null)} initialMode={authMode} />}
      </div>
    </BrowserRouter>
    </PlaybackProvider>
    </SettingsProvider>
    </NotificationsProvider>
    </ThemeProvider>
  );
}

export default App;
