import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import "./ResetPassword.scss";

const hints = (password: string) => [
  { label: "At least 8 characters", met: password.length >= 8 },
  { label: "One uppercase letter", met: /[A-Z]/.test(password) },
  { label: "One number", met: /[0-9]/.test(password) },
];

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const passwordHints = hints(password);
  const passwordValid = passwordHints.every((h) => h.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValid) {
      setError("Please meet all password requirements.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setError(error.message);
    else setDone(true);
  };

  if (done) {
    return (
      <div className="reset-password">
        <div className="reset-password__card">
          <p className="reset-password__title">Guitlab</p>
          <p className="reset-password__heading">Password updated</p>
          <p className="reset-password__sub">You're good to go.</p>
          <button
            className="reset-password__submit"
            onClick={() => navigate("/")}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="reset-password">
        <div className="reset-password__card">
          <p className="reset-password__title">Guitlab</p>
          <p className="reset-password__sub">Verifying your reset link…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password">
      <div className="reset-password__card">
        <p className="reset-password__title">Guitlab</p>
        <p className="reset-password__heading">Set a new password</p>

        <form onSubmit={handleSubmit}>
          <div className="reset-password__field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? (
                <IoEyeOffOutline size={16} />
              ) : (
                <IoEyeOutline size={16} />
              )}
            </button>
          </div>

          {password.length > 0 && (
            <ul className="reset-password__hints">
              {passwordHints.map((h) => (
                <li key={h.label} className={h.met ? "met" : ""}>
                  <span>{h.met ? "✓" : "·"}</span> {h.label}
                </li>
              ))}
            </ul>
          )}

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {error && <p className="reset-password__error">{error}</p>}

          <button
            type="submit"
            className="reset-password__submit"
            disabled={loading || !passwordValid || !confirm}
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
