import {
  FaArrowRight,
  FaCircleCheck,
  FaClock,
  FaLocationDot,
  FaStar,
  FaUserDoctor,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "../styles/hero.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <main className="hero">
      <div className="container hero-container">

        <div className="hero-content">
          <div className="hero-eyebrow"><span className="eyebrow-dot"></span> Healthcare that fits your life</div>

          <h1>
            Better care starts with a <em>better connection.</em>
          </h1>

          <p>
            Find the right doctor, book in minutes, and keep every appointment
            in one calm, secure place.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/patient/login")}
            >
              Book an appointment <FaArrowRight />
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/doctors")}
            >
              <FaUserDoctor /> Explore doctors
            </button>
          </div>

          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>AR</span><span>MK</span><span>JS</span>
            </div>
            <div><strong>12,000+ people</strong><small>found care this month</small></div>
            <div className="proof-rating"><FaStar /> <strong>4.9</strong><small>patient rating</small></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-kicker"><FaCircleCheck /> Verified specialists</div>
          <div className="hero-image">
          <img
            src="https://images.pexels.com/photos/8376171/pexels-photo-8376171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Doctor consulting with patient online"
          />
          </div>
          <div className="hero-appointment-card">
            <div className="appointment-avatar"><FaUserDoctor /></div>
            <div><small>Next available</small><strong>Dr. Sarah Wilson</strong><span>Cardiologist</span></div>
            <button aria-label="View available appointment"><FaArrowRight /></button>
          </div>
          <div className="visual-note"><FaClock /><span>Appointments from<br /><strong>8:00 am - 8:00 pm</strong></span></div>
        </div>

      </div>
      <div className="hero-location"><FaLocationDot /> Serving patients everywhere <span></span> Private by design</div>
    </main>
  );
}

export default Hero;
