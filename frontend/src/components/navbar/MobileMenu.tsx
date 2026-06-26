import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { IoSunnyOutline, IoMoonOutline, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { useSettings, type Settings } from "../../context/SettingsContext";
import "./MobileMenu.scss";

interface Props {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onAuthOpen: (mode: "login" | "signup") => void;
  onLogout: () => void;
  theme: string;
  toggleTheme: () => void;
}

const ANIM_MS = 280;

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const SCALES: { key: string; label: string }[] = [
  { key: "majorPentatonic", label: "Major Pentatonic" },
  { key: "majorScale", label: "Major Scale" },
  { key: "arpeggio", label: "Arpeggio" },
  { key: "minorPentatonic", label: "Minor Pentatonic" },
  { key: "minorScale", label: "Minor Scale" },
  { key: "minorArpeggio", label: "Minor Arpeggio" },
  { key: "dom7Scale", label: "Dom7 Scale (Mixolydian)" },
  { key: "dom7Arpeggio", label: "Dom7 Arpeggio" },
];

const OVERLAYS: { label: string; key: keyof Settings }[] = [
  { label: "Notes", key: "showNotes" },
  { label: "Degrees", key: "showDegrees" },
  { label: "Triads", key: "showTriads" },
  { label: "Dbl Stops", key: "showDoubleStops" },
];

const MobileMenu = ({ isOpen, user, onClose, onAuthOpen, onLogout, theme, toggleTheme }: Props) => {
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  const [view, setView] = useState<"links" | "controls">("links");
  const { settings, setSettings } = useSettings();

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const t = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, ANIM_MS);
      return () => clearTimeout(t);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleOverlay = (key: keyof Settings) =>
    setSettings((s: any) => ({
      ...s,
      [key]: !s[key],
      ...(key === "showNotes" && !s.showNotes && { showDegrees: false }),
      ...(key === "showDegrees" && !s.showDegrees && { showNotes: false }),
      ...(key === "showDoubleStops" && {
        showScaleWithDoubleStops: false,
        ...(!s.showDoubleStops && { showTriads: false }),
      }),
      ...(key === "showTriads" && !s.showTriads && { showDoubleStops: false }),
    }));

  if (!visible) return null;

  return (
    <>
      <div
        className={`mobile-menu-overlay${closing ? " mobile-menu-overlay--closing" : ""}`}
        onClick={onClose}
      />
      <div className={`mobile-menu${closing ? " mobile-menu--closing" : ""}`}>
        <div className="mobile-menu__handle" />

        <div className="mobile-menu__tabs">
          <button
            className={`mobile-menu__tab${view === "links" ? " mobile-menu__tab--active" : ""}`}
            onClick={() => setView("links")}
          >
            Links
          </button>
          <button
            className={`mobile-menu__tab${view === "controls" ? " mobile-menu__tab--active" : ""}`}
            onClick={() => setView("controls")}
          >
            Controls
          </button>
        </div>

        {view === "links" && (
          <ul>
            <li><Link to="/" onClick={onClose}>Home</Link></li>
            <li><Link to="/training" onClick={onClose}>The Lab</Link></li>
            {!user && (
              <li>
                <button onClick={() => { onAuthOpen("login"); onClose(); }}>Login</button>
              </li>
            )}
            {user && (
              <>
                <li>
                  <Link to="/settings" onClick={onClose}>
                    <IoSettingsOutline size={16} />Settings
                  </Link>
                </li>
                <li>
                  <button onClick={onLogout}>
                    <IoLogOutOutline size={16} />Logout
                  </button>
                </li>
              </>
            )}
            <li>
              <button onClick={() => { toggleTheme(); onClose(); }}>
                {theme === "dark" ? <IoSunnyOutline size={16} /> : <IoMoonOutline size={16} />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </li>
          </ul>
        )}

        {view === "controls" && (
          <div className="mobile-menu__controls">
            <span className="mobile-menu__controls-label">Key</span>
            <div className="mobile-menu__keys">
              {NOTES.map((note) => (
                <button
                  key={note}
                  className={`mobile-menu__key-btn${settings.key === note ? " mobile-menu__key-btn--active" : ""}`}
                  onClick={() => setSettings((s: any) => ({ ...s, key: note }))}
                >
                  {note}
                </button>
              ))}
            </div>

            <span className="mobile-menu__controls-label">Scale</span>
            <div className="mobile-menu__scales">
              {SCALES.map(({ key, label }) => (
                <button
                  key={key}
                  className={`mobile-menu__scale-btn${settings.scale === key ? " mobile-menu__scale-btn--active" : ""}`}
                  onClick={() => setSettings((s: any) => ({ ...s, scale: key }))}
                >
                  {label}
                </button>
              ))}
            </div>

            <span className="mobile-menu__controls-label">Overlay</span>
            <div className="mobile-menu__overlays">
              {OVERLAYS.map(({ label, key }) => (
                <button
                  key={key}
                  className={`mobile-menu__overlay-btn${settings[key] ? " mobile-menu__overlay-btn--active" : ""}`}
                  onClick={() => toggleOverlay(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileMenu;
