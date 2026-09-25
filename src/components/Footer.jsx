import { FaArrowRight, FaFacebookF, FaInstagram, FaLinkedinIn, FaLocationDot, FaPhone, FaEnvelope } from "react-icons/fa6";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">

        <div className="footer-box footer-intro">
          <h2>Medi<span>Connect</span></h2>
          <p>
            A calmer way to find trusted care, whenever you need it.
          </p>
          <a className="footer-cta" href="/doctors">Find your doctor <FaArrowRight /></a>
        </div>

        <div className="footer-box">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/doctors">Doctors</a>
          <a href="/patient/login">Patient Login</a>
          <a href="/doctor/login">Doctor Login</a>
        </div>

        <div className="footer-box">
          <h3>Contact</h3>

          <p><FaLocationDot /> Peshawar, Pakistan</p>
          <p><FaPhone /> +92 300 1234567</p>
          <p><FaEnvelope /> info@mediconnect.com</p>
        </div>

        <div className="footer-box">
          <h3>Follow Us</h3>

          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>

      <div className="copyright">
        © 2026 MediConnect. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;
