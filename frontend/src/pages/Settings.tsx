import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useUser } from "../hooks/useUser";
import { useTheme } from "../context/ThemeContext";
import { IoSunnyOutline, IoMoonOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { SCALE_LABELS, KEYS, DEFAULT_KEY_KEY, DEFAULT_SCALE_KEY } from "../constants/preferences";
import "./Settings.scss";

const Settings = () => {
  const { user, loaded } = useUser();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [editingPassword, setEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [defaultKey, setDefaultKey] = useState(localStorage.getItem(DEFAULT_KEY_KEY) ?? "C");
  const [defaultScale, setDefaultScale] = useState(localStorage.getItem(DEFAULT_SCALE_KEY) ?? "majorPentatonic");

  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const isGoogleUser = user?.app_metadata?.provider === "google";

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("username").eq("id", user.id).single()
      .then(({ data }) => { if (data?.username) setUsername(data.username); });
  }, [user]);

  useEffect(() => {
    if (loaded && !user) navigate("/");
  }, [loaded, user, navigate]);

  const flash = (text: string, ok = true) => {
    setMessage({ text, ok });
    setTimeout(() => setMessage(null), 3500);
  };

  const saveUsername = async () => {
    if (!user || !newUsername.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ username: newUsername.trim() }).eq("id", user.id);
    setSaving(false);
    if (error) flash(error.message, false);
    else { setUsername(newUsername.trim()); setEditingUsername(false); flash("Username updated."); }
  };

  const saveEmail = async () => {
    if (!newEmail.trim()) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setSaving(false);
    if (error) flash(error.message, false);
    else { setEditingEmail(false); flash("Confirmation sent to new email."); }
  };

  const savePassword = async () => {
    if (!newPassword) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) flash(error.message, false);
    else { setEditingPassword(false); setNewPassword(""); flash("Password updated."); }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDefaultKey = (key: string) => {
    setDefaultKey(key);
    localStorage.setItem(DEFAULT_KEY_KEY, key);
  };

  const handleDefaultScale = (scale: string) => {
    setDefaultScale(scale);
    localStorage.setItem(DEFAULT_SCALE_KEY, scale);
  };

  return (
    <div className="settings">
      <div className="settings__hero">
        <h1>Settings</h1>
      </div>

      {message && (
        <div className={`settings__flash ${message.ok ? "settings__flash--ok" : "settings__flash--err"}`}>
          {message.text}
        </div>
      )}

      <div className="settings__content">
        <section className="settings__section">
          <h2>Account</h2>

          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">Username</span>
              {!editingUsername && <span className="settings__row-value">{username || "Not set"}</span>}
            </div>
            {editingUsername ? (
              <div className="settings__inline-form">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="New username"
                  autoFocus
                />
                <button className="settings__btn settings__btn--primary" onClick={saveUsername} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button className="settings__btn" onClick={() => setEditingUsername(false)}>Cancel</button>
              </div>
            ) : (
              <button className="settings__btn" onClick={() => { setNewUsername(username); setEditingUsername(true); }}>
                Edit
              </button>
            )}
          </div>

          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">Email</span>
              {!editingEmail && <span className="settings__row-value">{user?.email}</span>}
            </div>
            {editingEmail ? (
              <div className="settings__inline-form">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="New email"
                  autoFocus
                />
                <button className="settings__btn settings__btn--primary" onClick={saveEmail} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button className="settings__btn" onClick={() => setEditingEmail(false)}>Cancel</button>
              </div>
            ) : (
              <button className="settings__btn" onClick={() => { setNewEmail(user?.email ?? ""); setEditingEmail(true); }}>
                Edit
              </button>
            )}
          </div>

          {!isGoogleUser && (
            <div className="settings__row">
              <div className="settings__row-info">
                <span className="settings__row-label">Password</span>
                {!editingPassword && <span className="settings__row-value">••••••••</span>}
              </div>
              {editingPassword ? (
                <div className="settings__inline-form">
                  <div className="settings__password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)}>
                      {showPassword ? <IoEyeOffOutline size={15} /> : <IoEyeOutline size={15} />}
                    </button>
                  </div>
                  <button className="settings__btn settings__btn--primary" onClick={savePassword} disabled={saving || !newPassword}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button className="settings__btn" onClick={() => { setEditingPassword(false); setNewPassword(""); }}>Cancel</button>
                </div>
              ) : (
                <button className="settings__btn" onClick={() => setEditingPassword(true)}>Change</button>
              )}
            </div>
          )}

          <div className="settings__row settings__row--danger">
            <div className="settings__row-info">
              <span className="settings__row-label">Delete account</span>
              <span className="settings__row-value">This cannot be undone.</span>
            </div>
            <button
              className={`settings__btn settings__btn--danger ${deleteConfirm ? "settings__btn--confirm" : ""}`}
              onClick={handleDeleteAccount}
            >
              {deleteConfirm ? "Confirm delete" : "Delete"}
            </button>
          </div>
        </section>

        <section className="settings__section">
          <h2>Preferences</h2>

          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">Theme</span>
              <span className="settings__row-value">{theme === "dark" ? "Dark" : "Light"}</span>
            </div>
            <button className="settings__btn settings__btn--icon" onClick={toggleTheme}>
              {theme === "dark" ? <IoSunnyOutline size={16} /> : <IoMoonOutline size={16} />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>

          <div className="settings__row settings__row--wrap">
            <div className="settings__row-info">
              <span className="settings__row-label">Default key</span>
              <span className="settings__row-value">Opens fretboard in this key</span>
            </div>
            <div className="settings__key-grid">
              {KEYS.map((k) => (
                <button
                  key={k}
                  className={`settings__key-btn ${defaultKey === k ? "settings__key-btn--active" : ""}`}
                  onClick={() => handleDefaultKey(k)}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="settings__row settings__row--wrap">
            <div className="settings__row-info">
              <span className="settings__row-label">Default scale</span>
              <span className="settings__row-value">Opens fretboard with this overlay</span>
            </div>
            <div className="settings__scale-list">
              {Object.entries(SCALE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  className={`settings__scale-btn ${defaultScale === key ? "settings__scale-btn--active" : ""}`}
                  onClick={() => handleDefaultScale(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
