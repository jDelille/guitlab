import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useUser } from "../../hooks/useUser";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../context/NotificationContext";
import { IoSunnyOutline, IoMoonOutline, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { RiMenuLine } from "react-icons/ri";
import NotificationPanel from "./NotificationPanel";

import "./Navbar.scss";

interface Props {
  onAuthOpen: (mode: "login" | "signup") => void;
}

const Navbar = ({ onAuthOpen }: Props) => {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    supabase.auth.signOut();
    setMenuOpen(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
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
        <div className="logo">
          <p>Guitlab</p>
        </div>

        <ul className="links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/training">The Lab</Link></li>
          {!user && (
            <>
              <li><button onClick={() => onAuthOpen("login")} className="auth-btn">Login</button></li>
              <li><button onClick={() => onAuthOpen("signup")} className="auth-btn">Sign Up</button></li>
            </>
          )}
        </ul>

        <ul className="nav-settings">
          {!user && (
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <IoSunnyOutline color="var(--text-primary)" />
            </button>
          )}
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
              {unreadCount > 0 && (
                <span className="bell__badge">{unreadCount}</span>
              )}
            </button>
            <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>
          {user && (
            <div className="user-menu-wrapper" ref={menuRef}>
              <button
                className="user-icon-btn"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="User menu"
              >
                <RiMenuLine color="var(--text-primary)" size={18}/>
              </button>
              <div className={`user-menu${menuOpen ? " user-menu--open" : ""}`}>
                <span className="user-menu-email">{user.email}</span>
                <ul>
                  <li>
                    <button className="theme-row" onClick={toggleTheme}>
                      {theme === "dark" ? <IoSunnyOutline size={14} /> : <IoMoonOutline size={14} />}
                      {theme === "dark" ? "Light mode" : "Dark mode"}
                    </button>
                  </li>
                  <li>
                    <Link to="/settings" onClick={() => setMenuOpen(false)}>
                      <IoSettingsOutline size={14} />Settings
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>
                      <IoLogOutOutline size={14} />Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </ul>

        <button
          className="hamburger"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={mobileOpen ? "bar bar--open" : "bar"} />
          <span className={mobileOpen ? "bar bar--open" : "bar"} />
          <span className={mobileOpen ? "bar bar--open" : "bar"} />
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <ul>
            <li><Link to="/" onClick={() => setMobileOpen(false)}>Home</Link></li>
            <li><Link to="/training" onClick={() => setMobileOpen(false)}>The Lab</Link></li>
            {!user && (
              <>
                <li>
                  <button onClick={() => { onAuthOpen("login"); setMobileOpen(false); }}>Login</button>
                </li>
                <li>
                  <button onClick={() => { onAuthOpen("signup"); setMobileOpen(false); }}>Sign Up</button>
                </li>
              </>
            )}
            {user && (
              <>
                <li>
                  <Link to="/settings" onClick={() => setMobileOpen(false)}>
                    <IoSettingsOutline size={14} />Settings
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout}>
                    <IoLogOutOutline size={14} />Logout
                  </button>
                </li>
              </>
            )}
            <li>
              <button onClick={() => { toggleTheme(); setMobileOpen(false); }}>
                {theme === "dark" ? <IoSunnyOutline size={14} /> : <IoMoonOutline size={14} />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
