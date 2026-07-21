import { FaUserDoctor } from "react-icons/fa6";
import "./../styles/navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-container">

        <div className="logo">
          <FaUserDoctor className="logo-icon" />
         <h2>
  Medi<span>Connect</span>
</h2>
        </div>

        <nav>
          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Doctors</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>

        <div className="nav-buttons">
          <button className="login-btn">Login</button>
          <button className="register-btn">Register</button>
        </div>

      </div>
    </header>
  );
}

export default Navbar;