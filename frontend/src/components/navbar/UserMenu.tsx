import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { RiMenuLine } from "react-icons/ri";
import { useUserStats } from "../../hooks/useUserStats";
import "./UserMenu.scss";

interface Props {
  user: User;
  theme: string;
  toggleTheme: () => void;
  onLogout: () => void;
}

const UserMenu = ({ user, theme, toggleTheme, onLogout }: Props) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { stats, completedDrills } = useUserStats();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const close = () => setOpen(false);

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      <button
        className="user-menu-wrapper__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="User menu"
      >
        <RiMenuLine color="var(--text-primary)" size={18} />
      </button>

      <div className={`user-menu${open ? " user-menu--open" : ""}`}>
        <div className="user-menu__header">
          <span className="user-menu__email">{user.email}</span>
        </div>

        <div className="user-menu__links">
          <Link className="user-menu__link" to="/" onClick={close}>Home</Link>
          <Link className="user-menu__link" to="/training" onClick={close}>The Lab</Link>
          <Link className="user-menu__link" to="/settings" onClick={close}>Settings</Link>
          <button className="user-menu__link" onClick={toggleTheme}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>

        {stats && (
          <>
            <div className="user-menu__divider" />
            <div className="user-menu__stats-grid">
              <div className="user-menu__stat">
                <span className="user-menu__stat-value">{stats.totalPoints.toLocaleString()}</span>
                <span className="user-menu__stat-label">Points</span>
              </div>
              <div className="user-menu__stat">
                <span className="user-menu__stat-value">{stats.solvedCombos}</span>
                <span className="user-menu__stat-label">Combos Solved</span>
              </div>
              <div className="user-menu__stat">
                <span className="user-menu__stat-value">{stats.totalAttempts}</span>
                <span className="user-menu__stat-label">Attempts</span>
              </div>
              <div className="user-menu__stat">
                <span className="user-menu__stat-value">{completedDrills.size}</span>
                <span className="user-menu__stat-label">Drills Complete</span>
              </div>
            </div>
          </>
        )}

        <div className="user-menu__divider" />
        <button className="user-menu__logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
