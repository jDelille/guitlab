import { useState } from "react";
import { supabase } from "../../services/supabase";
import { FcGoogle } from "react-icons/fc";
import { IoEyeOutline, IoEyeOffOutline, IoCloseOutline } from "react-icons/io5";
import "./AuthModal.scss";

type Mode = "login" | "signup" | "forgot";

interface Props {
  onClose: () => void;
  initialMode?: "login" | "signup";
}

const MIN_PASSWORD_LENGTH = 8;

const passwordHints = (password: string) => [
  {
    label: "At least 8 characters",
    met: password.length >= MIN_PASSWORD_LENGTH,
  },
  { label: "One uppercase letter", met: /[A-Z]/.test(password) },
  { label: "One number", met: /[0-9]/.test(password) },
];

const AuthModal = ({ onClose, initialMode = "login" }: Props) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const hints = passwordHints(password);
  const passwordValid = hints.every((h) => h.met);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "forgot") {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setForgotSent(true);
      }
      return;
    }

    if (mode === "signup" && !passwordValid) {
      setError("Please meet all password requirements.");
      return;
    }

    setLoading(true);

    if (mode === "login") {
      let loginEmail = emailOrUsername;
      if (!emailOrUsername.includes("@")) {
        const { data } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", emailOrUsername)
          .single();
        if (!data?.email) {
          setLoading(false);
          setError("No account found with that username.");
          return;
        }
        loginEmail = data.email;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        onClose();
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setLoading(false);
        setError(error.message);
        return;
      }
      if (data.user) {
        await supabase
          .from("profiles")
          .update({ username })
          .eq("id", data.user.id);
      }
      setLoading(false);
      setSignupDone(true);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setPassword("");
    setForgotSent(false);
    setSignupDone(false);
  };

  if (signupDone) {
    return (
      <div className="auth-overlay" onClick={onClose}>
        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          <button className="auth-close" onClick={onClose} aria-label="Close">
            <IoCloseOutline size={20} />
          </button>
          <p className="title">Guitlab</p>
          <div className="auth-confirm">
            <p className="auth-confirm__heading">Check your email</p>
            <p className="auth-confirm__body">
              We sent a confirmation link to <strong>{email}</strong>. Click it
              to activate your account.
            </p>
            <button className="auth-submit" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <IoCloseOutline size={20} />
        </button>
        <p className="title">Guitlab</p>

        {mode === "forgot" ? (
          forgotSent ? (
            <div className="auth-confirm">
              <p className="auth-confirm__heading">Email sent</p>
              <p className="auth-confirm__body">
                Check <strong>{email}</strong> for a password reset link.
              </p>
              <button
                className="auth-submit"
                onClick={() => switchMode("login")}
              >
                Back to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="auth-hint-text">
                Enter your email and we'll send you a reset link.
              </p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <p className="auth-error">{error}</p>}
              <button
                type="submit"
                className="auth-submit"
                disabled={loading || !email}
              >
                {loading ? "..." : "Send reset link"}
              </button>
              <p className="auth-switch">
                <button type="button" onClick={() => switchMode("login")}>
                  Back to login
                </button>
              </p>
            </form>
          )
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              )}
              {mode === "login" ? (
                <input
                  type="text"
                  placeholder="Email or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                />
              ) : (
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              )}
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={16} />
                  ) : (
                    <IoEyeOutline size={16} />
                  )}
                </button>
              </div>

              {mode === "signup" && password.length > 0 && (
                <ul className="password-hints">
                  {hints.map((h) => (
                    <li key={h.label} className={h.met ? "met" : ""}>
                      <span>{h.met ? "✓" : "·"}</span> {h.label}
                    </li>
                  ))}
                </ul>
              )}

              {mode === "login" && (
                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => switchMode("forgot")}
                >
                  Forgot password?
                </button>
              )}

              {error && <p className="auth-error">{error}</p>}
              <button
                type="submit"
                className="auth-submit"
                disabled={
                  loading ||
                  !password ||
                  (mode === "login" ? !emailOrUsername : !email) ||
                  (mode === "signup" && (!username || !passwordValid))
                }
              >
                {loading ? "..." : mode === "login" ? "Login" : "Sign Up"}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button
              className="google-btn"
              onClick={() =>
                supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo: window.location.origin },
                })
              }
            >
              <FcGoogle size={18} />
              Continue with Google
            </button>

            <p className="auth-switch">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                onClick={() =>
                  switchMode(mode === "login" ? "signup" : "login")
                }
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
