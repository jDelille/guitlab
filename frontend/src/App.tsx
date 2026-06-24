import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import AuthModal from "./components/auth/AuthModal";
import Home from "./pages/Home";
import Training from "./pages/Training";
import Drill from "./pages/Drill";
import ResetPassword from "./pages/ResetPassword";
import HowToGuide from "./pages/HowToGuide";
import Settings from "./pages/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  return (
    <ThemeProvider>
    <BrowserRouter>
      <div className="page">
        <div className="layout">
          <Navbar onAuthOpen={(mode) => setAuthMode(mode)} />
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
        </div>
        <Footer />
        {authMode && <AuthModal onClose={() => setAuthMode(null)} initialMode={authMode} />}
      </div>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
