import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useUser } from "../../hooks/useUser";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../context/NotificationContext";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import NotificationPanel from "./NotificationPanel";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import BottomNav from "./BottomNav";
import "./Navbar.scss";

interface Props {
  onAuthOpen: (mode: "login" | "signup") => void;
}

const Navbar = ({ onAuthOpen }: Props) => {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    supabase.auth.signOut();
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">
          <p>Guitlab</p>
        </Link>

        <ul className="links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/training" id="tour-lab">The Lab</Link></li>
        </ul>

        <ul className="nav-settings">
          {!user && (
            <>
              <button className="sign-in-btn" onClick={() => onAuthOpen("login")}>
                Login
              </button>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === "dark"
                  ? <IoSunnyOutline color="var(--text-primary)" />
                  : <IoMoonOutline color="var(--text-primary)" />}
              </button>
            </>
          )}
          {user && (
            <>
              <div className="notifications-wrapper" ref={notifRef}>
                <button
                  className="bell"
                  aria-label="Notifications"
                  onClick={() => setNotifOpen((o) => !o)}
                >
                  <FaRegBell
                    color={unreadCount > 0 ? "var(--red)" : "var(--text-primary)"}
                    size={18}
                  />
                  {unreadCount > 0 && <span className="bell__badge">{unreadCount}</span>}
                </button>
                <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
              </div>
              <UserMenu
                user={user}
                theme={theme}
                toggleTheme={toggleTheme}
                onLogout={handleLogout}
              />
            </>
          )}
        </ul>

        {user && (
          <div className="mobile-actions">
            <div className="notifications-wrapper" ref={notifRef}>
              <button
                className="bell"
                aria-label="Notifications"
                onClick={() => setNotifOpen((o) => !o)}
              >
                <FaRegBell
                  color={unreadCount > 0 ? "var(--red)" : "var(--text-primary)"}
                  size={18}
                />
                {unreadCount > 0 && <span className="bell__badge">{unreadCount}</span>}
              </button>
              <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>
          </div>
        )}
      </div>

      <MobileMenu
        isOpen={mobileOpen}
        user={user}
        onClose={() => setMobileOpen(false)}
        onAuthOpen={onAuthOpen}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <BottomNav isOpen={mobileOpen} onToggle={() => setMobileOpen((o) => !o)} />
    </div>
  );
};

export default Navbar;
