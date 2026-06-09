import "./Navbar.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="content">
        <div className="logo">
          <p>Fretify</p>
        </div>
        <ul className="links">
          <li>Home</li>
          <li>Ear Training</li>
          <li>Community</li>
          <li>About</li>
          <li>Profile</li>
        </ul>
        {/* <ul className="settings">
          <button>Login</button>
          <button>Signup</button>
        </ul> */}
      </div>
    </div>
  );
};

export default Navbar;
