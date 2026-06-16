import { Link } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useUser } from "../../hooks/useUser";
import "./Navbar.scss";

interface Props {
  onAuthOpen: (mode: "login" | "signup") => void;
}

const Navbar = ({ onAuthOpen }: Props) => {
  const user = useUser();
  const handleLogout = () => supabase.auth.signOut();

  return (
    <div className="navbar">
      <div className="content">
        <div className="logo">
          <p>Uncaged</p>
        </div>
        <ul className="links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/training">Training</Link></li>
        </ul>
        <ul className="settings">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
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
