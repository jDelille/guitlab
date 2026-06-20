import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useUser } from "../../hooks/useUser";
import { useTheme } from "../../context/ThemeContext";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";

import "./Navbar.scss";

interface Props {
  onAuthOpen: (mode: "login" | "signup") => void;
}

const Navbar = ({ onAuthOpen }: Props) => {
  const user = useUser();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    supabase.auth.signOut();
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <div className="content">
        <div className="logo">
          <p>Guitlab</p>
        </div>
        <ul className="links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/training">Training</Link>
          </li>
        </ul>
        <ul className="settings">
          {!user && (
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <IoSunnyOutline color="var(--text-primary)" />
            </button>
          )}
          {user ? (
            <div className="user-menu-wrapper" ref={menuRef}>
              <button
                className="user-icon-btn"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="User menu"
              >
                <FaRegCircleUser />
              </button>
              {menuOpen && (
                <div className="user-menu">
                  <span className="user-menu-email">{user.email}</span>
                  <ul>
                    <li>
                      <button className="theme-row" onClick={toggleTheme}>
                        {theme === "dark" ? (
                          <IoSunnyOutline size={14} />
                        ) : (
                          <IoMoonOutline size={14} />
                        )}
                        {theme === "dark" ? "Light mode" : "Dark mode"}
                      </button>
                    </li>
                    <li>
                      <button onClick={handleLogout}>
                        <IoLogOutOutline size={14} />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => onAuthOpen("login")}>Login</button>
              <button onClick={() => onAuthOpen("signup")}>Sign Up</button>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
