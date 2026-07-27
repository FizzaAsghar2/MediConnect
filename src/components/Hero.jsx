import { FaCalendarCheck, FaUserDoctor } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "../styles/hero.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="container hero-container">

        <div className="hero-content">
          <span className="hero-tag">Your Health, Our Priority</span>

          <h1>
            Find <span>Trusted Doctors</span> Online
          </h1>

          <p>
            Book appointments, consult experienced doctors online, and manage
            your healthcare with ease through MediConnect.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/patient/login")}
            >
              <FaCalendarCheck /> Book Appointment
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/doctors")}
            >
              <FaUserDoctor /> Find Doctors
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=700"
            alt="Doctor"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;