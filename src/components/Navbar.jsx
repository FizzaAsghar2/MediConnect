import { FaUserDoctor } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import "./../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container nav-container">

        {/* Logo */}
        <div className="logo">
          <FaUserDoctor className="logo-icon" />
          <h2>
            <Link
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Medi<span>Connect</span>
            </Link>
          </h2>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/doctors">Doctors</Link>
            </li>

            <li>
              <Link to="/about">About</Link>
            </li>

            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        {/* Buttons */}
        <div className="nav-buttons">
          <button
            className="login-btn"
            onClick={() => navigate("/patient/login")}
          >
            Login
          </button>

          <button
            className="register-btn"
            onClick={() => navigate("/patient/register")}
          >
            Register
          </button>
        </div>

      </div>
    </header>
  );
}

export default Navbar;