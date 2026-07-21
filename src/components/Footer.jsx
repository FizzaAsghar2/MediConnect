import { FaFacebookF, FaInstagram, FaLinkedinIn, FaLocationDot, FaPhone, FaEnvelope } from "react-icons/fa6";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">

        <div className="footer-box">
          <h2>
  Medi<span style={{ color: "#F3EEFF" }}>Connect</span>
</h2>
          <p>
            Your trusted online healthcare platform connecting patients with
            qualified doctors anytime, anywhere.
          </p>
        </div>

        <div className="footer-box">
          <h3>Quick Links</h3>

          <a href="#">Home</a>
          <a href="#">Doctors</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
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
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
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