import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <p className="footer-logo">Guitlab</p>
          <p className="footer-tagline">Unlock the fretboard.</p>
        </div>
        <div className="footer-col">
          <p className="footer-col__title">Navigate</p>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/training">The Lab</Link>
            </li>
            <li>
              <Link to={"/"}>Login</Link>
            </li>
            <li>
              <Link to={"/"}>Sign Up</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <p className="footer-col__title">Help Center</p>
          <ul>
            <li>
              <Link to="/how-to-guide">How-to Guide</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <p className="footer-col__title">Socials</p>
          <ul>
            <li>
              <a
                href="https://github.com/jDelille"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://justindelille.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/justin-delille/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Guitlab</p>
        <div className="footer-bottom__links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <p>Built by jDelille</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
