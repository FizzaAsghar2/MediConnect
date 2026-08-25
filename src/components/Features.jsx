import { FaUserDoctor, FaCalendarCheck, FaNotesMedical } from "react-icons/fa6";
import "../styles/features.css";

function Features() {
  return (
    <section className="features">
      <div className="container">

        <h2 className="section-title">Why Choose MediConnect?</h2>

        <p className="section-subtitle">
          Everything you need to connect with trusted healthcare professionals
          from the comfort of your home.
        </p>

        <div className="feature-grid">

          <div className="feature-card">
            <FaUserDoctor className="feature-icon" />
            <h3>Expert Doctors</h3>
            <p>
              Find experienced specialists across multiple medical fields.
            </p>
          </div>

          <div className="feature-card">
            <FaCalendarCheck className="feature-icon" />
            <h3>Easy Appointments</h3>
            <p>
              Book appointments online in just a few clicks without waiting.
            </p>
          </div>

          <div className="feature-card">
            <FaNotesMedical className="feature-icon" />
            <h3>Health Records</h3>
            <p>
              Manage your appointments and medical information securely.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Features;