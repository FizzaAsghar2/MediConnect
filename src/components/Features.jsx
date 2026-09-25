import { FaArrowRight, FaCalendarCheck, FaNotesMedical, FaShieldHeart, FaUserDoctor } from "react-icons/fa6";
import "../styles/features.css";

function Features() {
  return (
    <section className="features" id="how-it-works">
      <div className="container">

        <div className="section-heading">
          <div><span className="section-kicker">One less thing to worry about</span><h2 className="section-title">Care, without the runaround.</h2></div>
          <p className="section-subtitle">A simpler way to move from “I need help” to “I feel looked after.”</p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <FaUserDoctor className="feature-icon" />
            <span className="feature-number">01</span><h3>Meet the right expert</h3>
            <p>
              Browse trusted specialists by expertise, availability, and the kind of care you need.
            </p>
            <FaArrowRight className="feature-arrow" />
          </div>

          <div className="feature-card">
            <FaCalendarCheck className="feature-icon" />
            <span className="feature-number">02</span><h3>Choose your moment</h3>
            <p>
              See a schedule that works for you and reserve an appointment in a few calm clicks.
            </p>
            <FaArrowRight className="feature-arrow" />
          </div>

          <div className="feature-card">
            <FaNotesMedical className="feature-icon" />
            <span className="feature-number">03</span><h3>Stay in control</h3>
            <p>
              Keep appointments and care details organized in one private patient dashboard.
            </p>
            <FaArrowRight className="feature-arrow" />
          </div>

        </div>

        <div className="trust-strip">
          <div className="trust-copy"><FaShieldHeart /><span><strong>Thoughtful by default</strong><small>Your health information stays yours.</small></span></div>
          <div className="trust-metrics"><span><strong>24/7</strong><small>Access to your care</small></span><span><strong>100%</strong><small>Patient focused</small></span><span><strong>1 place</strong><small>For every appointment</small></span></div>
        </div>

      </div>
    </section>
  );
}

export default Features;